/**
 * One-off media compressor: recompress large images + transcode heavy mp4s.
 * Large photo PNGs become .jpg (same basename); prints path renames for content updates.
 * Run: node scripts/compress-media.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import ffmpegPath from 'ffmpeg-static'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')

const IMAGE_MIN_BYTES = 450 * 1024
const PNG_TO_JPEG_MIN = 800 * 1024
const VIDEO_TARGETS = [
  { rel: 'videos/car-motion.mp4', maxW: 1280, crf: 28 },
  { rel: 'videos/abalone-motion.mp4', maxW: 1280, crf: 26 },
]

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name)
    if (name.isDirectory()) walk(full, out)
    else out.push(full)
  }
  return out
}

function mb(n) {
  return (n / 1024 / 1024).toFixed(2)
}

function webPath(file) {
  return '/' + path.relative(publicDir, file).split(path.sep).join('/')
}

async function compressImage(file) {
  const before = fs.statSync(file).size
  if (before < IMAGE_MIN_BYTES) return null

  const ext = path.extname(file).toLowerCase()
  const meta = await sharp(file, { failOn: 'none' }).metadata()
  const width = meta.width && meta.width > 1600 ? 1600 : undefined
  const resize = width ? { width, withoutEnlargement: true } : undefined
  const base = sharp(file, { failOn: 'none' }).rotate().resize(resize)

  // Heavy PNGs → JPEG (much smaller for photos / renders)
  if (ext === '.png' && before >= PNG_TO_JPEG_MIN) {
    const jpgPath = file.replace(/\.png$/i, '.jpg')
    const tmp = `${jpgPath}.__tmp__`
    await base.jpeg({ quality: 80, mozjpeg: true }).toFile(tmp)
    const after = fs.statSync(tmp).size
    if (after >= before * 0.9) {
      fs.rmSync(tmp, { force: true })
      // fall through to png recompress
    } else {
      fs.renameSync(tmp, jpgPath)
      if (path.resolve(jpgPath) !== path.resolve(file)) fs.rmSync(file, { force: true })
      return {
        file: jpgPath,
        before,
        after,
        rename: { from: webPath(file), to: webPath(jpgPath) },
      }
    }
  }

  const tmp = `${file}.__tmp__`
  if (ext === '.jpg' || ext === '.jpeg') {
    await sharp(file, { failOn: 'none' })
      .rotate()
      .resize(resize)
      .jpeg({ quality: 78, mozjpeg: true })
      .toFile(tmp)
  } else if (ext === '.png') {
    await sharp(file, { failOn: 'none' })
      .rotate()
      .resize(resize)
      .png({ compressionLevel: 9 })
      .toFile(tmp)
  } else {
    return null
  }

  const after = fs.statSync(tmp).size
  if (after >= before * 0.98) {
    fs.rmSync(tmp, { force: true })
    return null
  }
  fs.renameSync(tmp, file)
  return { file, before, after }
}

async function compressImages() {
  const files = walk(publicDir).filter((f) => /\.(jpe?g|png)$/i.test(f))
  const results = []
  for (const file of files) {
    try {
      const r = await compressImage(file)
      if (r) results.push(r)
    } catch (err) {
      console.warn('image skip', path.relative(publicDir, file), err.message)
    }
  }
  return results
}

function compressVideo({ rel, maxW, crf }) {
  const input = path.join(publicDir, rel)
  if (!fs.existsSync(input)) return null
  const before = fs.statSync(input).size
  const tmp = `${input}.__tmp__.mp4`
  const args = [
    '-y',
    '-i',
    input,
    '-vf',
    `scale='min(${maxW},iw)':-2`,
    '-c:v',
    'libx264',
    '-crf',
    String(crf),
    '-preset',
    'medium',
    '-movflags',
    '+faststart',
    '-c:a',
    'aac',
    '-b:a',
    '96k',
    tmp,
  ]
  console.log('ffmpeg', rel, '...')
  const res = spawnSync(ffmpegPath, args, { stdio: 'inherit' })
  if (res.status !== 0 || !fs.existsSync(tmp)) {
    fs.rmSync(tmp, { force: true })
    console.warn('ffmpeg failed', rel)
    return null
  }
  const after = fs.statSync(tmp).size
  if (after >= before * 0.95) {
    fs.rmSync(tmp, { force: true })
    console.log('keep original (not smaller)', rel)
    return null
  }
  fs.renameSync(tmp, input)
  return { file: input, before, after }
}

function applyRenames(renames) {
  if (!renames.length) return
  const contentFile = path.join(root, 'src', 'content', 'portfolio.js')
  let text = fs.readFileSync(contentFile, 'utf8')
  for (const { from, to } of renames) {
    if (text.includes(from)) {
      text = text.split(from).join(to)
      console.log('portfolio path', from, '→', to)
    }
  }
  fs.writeFileSync(contentFile, text)
}

const imgResults = await compressImages()
console.log('\nImages compressed:', imgResults.length)
for (const r of imgResults) {
  console.log(`  ${mb(r.before)} → ${mb(r.after)} MB  ${path.relative(publicDir, r.file)}`)
}
applyRenames(imgResults.filter((r) => r.rename).map((r) => r.rename))

const vidResults = []
for (const t of VIDEO_TARGETS) {
  const r = compressVideo(t)
  if (r) vidResults.push(r)
}
console.log('\nVideos compressed:', vidResults.length)
for (const r of vidResults) {
  console.log(`  ${mb(r.before)} → ${mb(r.after)} MB  ${path.relative(publicDir, r.file)}`)
}
