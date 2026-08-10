import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './DesignMode.css'

const STORAGE_KEY = 'luoyezi-design-tweaks'
const STYLE_KEYS = ['fontSize', 'color', 'backgroundColor', 'translateX', 'translateY']

function cssPath(el) {
  if (!el || el.nodeType !== 1) return ''
  if (el.id) return `#${CSS.escape(el.id)}`
  const parts = []
  let node = el
  while (node && node.nodeType === 1 && node !== document.documentElement) {
    let part = node.nodeName.toLowerCase()
    if (node.classList?.length) {
      const cls = [...node.classList]
        .filter((c) => !c.startsWith('design-') && c !== 'data-reveal' && !c.startsWith('is-'))
        .slice(0, 2)
      if (cls.length) part += cls.map((c) => `.${CSS.escape(c)}`).join('')
    }
    const parent = node.parentElement
    if (parent) {
      const same = [...parent.children].filter((c) => c.nodeName === node.nodeName)
      if (same.length > 1) part += `:nth-of-type(${same.indexOf(node) + 1})`
    }
    parts.unshift(part)
    if (node.id) break
    node = parent
  }
  return parts.join(' > ')
}

function readTweaks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function writeTweaks(map) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
}

function applyTweak(el, tweak) {
  if (!el || !tweak) return
  if (tweak.fontSize != null) el.style.fontSize = `${tweak.fontSize}px`
  else el.style.removeProperty('font-size')
  if (tweak.color) el.style.color = tweak.color
  else el.style.removeProperty('color')
  if (tweak.backgroundColor) el.style.backgroundColor = tweak.backgroundColor
  else el.style.removeProperty('background-color')
  const x = tweak.translateX || 0
  const y = tweak.translateY || 0
  if (x || y) el.style.transform = `translate(${x}px, ${y}px)`
  else el.style.removeProperty('transform')
}

function clearInline(el) {
  if (!el) return
  el.style.removeProperty('font-size')
  el.style.removeProperty('color')
  el.style.removeProperty('background-color')
  el.style.removeProperty('transform')
}

function isUi(el) {
  return Boolean(el?.closest?.('.design-fab, .design-panel'))
}

function editableTarget(el) {
  if (!el || isUi(el)) return null
  let node = el
  if (node.nodeType !== 1) node = node.parentElement
  while (node && node !== document.body) {
    if (isUi(node)) return null
    const tag = node.tagName
    if (
      ['H1', 'H2', 'H3', 'H4', 'H5', 'P', 'SPAN', 'A', 'BUTTON', 'LI', 'STRONG', 'EM', 'FIGCAPTION', 'LABEL'].includes(tag) ||
      node.classList?.contains('media-slide-label') ||
      node.classList?.contains('ability-award') ||
      node.classList?.contains('ability-project-title') ||
      node.classList?.contains('ability-title') ||
      node.classList?.contains('ph-label')
    ) {
      return node
    }
    node = node.parentElement
  }
  return el.nodeType === 1 ? el : null
}

function computedState(el) {
  if (!el) return null
  const cs = getComputedStyle(el)
  const fontSize = parseFloat(cs.fontSize) || 16
  const color = rgbToHex(cs.color) || '#1e4578'
  const bg = cs.backgroundColor
  const backgroundColor = bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent' ? '#ffffff' : rgbToHex(bg) || '#ffffff'
  const tr = cs.transform
  let translateX = 0
  let translateY = 0
  if (tr && tr !== 'none') {
    const m = tr.match(/matrix\(([^)]+)\)/)
    if (m) {
      const parts = m[1].split(',').map((n) => parseFloat(n.trim()))
      translateX = Math.round(parts[4] || 0)
      translateY = Math.round(parts[5] || 0)
    }
  }
  return { fontSize: Math.round(fontSize), color, backgroundColor, translateX, translateY }
}

function rgbToHex(input) {
  if (!input) return ''
  if (input.startsWith('#')) return input
  const m = input.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i)
  if (!m) return ''
  return `#${[m[1], m[2], m[3]].map((n) => Number(n).toString(16).padStart(2, '0')).join('')}`
}

export default function DesignMode() {
  const [on, setOn] = useState(false)
  const [path, setPath] = useState('')
  const [form, setForm] = useState(null)
  const selectedRef = useRef(null)
  const hoverRef = useRef(null)
  const dragRef = useRef(null)
  const tweaksRef = useRef(readTweaks())

  const reapplyAll = useCallback(() => {
    const map = tweaksRef.current
    Object.entries(map).forEach(([selector, tweak]) => {
      document.querySelectorAll(selector).forEach((el) => applyTweak(el, tweak))
    })
  }, [])

  useEffect(() => {
    reapplyAll()
  }, [reapplyAll])

  useEffect(() => {
    document.documentElement.classList.toggle('design-editing', on)
    if (!on) {
      hoverRef.current?.classList.remove('design-hover')
      selectedRef.current?.classList.remove('design-selected')
      hoverRef.current = null
      selectedRef.current = null
      setPath('')
      setForm(null)
    }
    return () => document.documentElement.classList.remove('design-editing')
  }, [on])

  const selectEl = useCallback((el) => {
    if (!el) return
    selectedRef.current?.classList.remove('design-selected')
    selectedRef.current = el
    el.classList.add('design-selected')
    const p = cssPath(el)
    setPath(p)
    const saved = tweaksRef.current[p]
    setForm(saved ? { ...computedState(el), ...saved } : computedState(el))
  }, [])

  const commit = useCallback((next) => {
    const el = selectedRef.current
    if (!el || !path) return
    setForm(next)
    const tweak = {}
    STYLE_KEYS.forEach((k) => {
      if (next[k] != null && next[k] !== '') tweak[k] = next[k]
    })
    applyTweak(el, tweak)
    tweaksRef.current = { ...tweaksRef.current, [path]: tweak }
    writeTweaks(tweaksRef.current)
  }, [path])

  useEffect(() => {
    if (!on) return undefined

    const onMove = (e) => {
      if (dragRef.current) {
        const { el, startX, startY, baseX, baseY, basePath } = dragRef.current
        const dx = Math.round(e.clientX - startX)
        const dy = Math.round(e.clientY - startY)
        const next = {
          ...(tweaksRef.current[basePath] || computedState(el)),
          translateX: baseX + dx,
          translateY: baseY + dy,
        }
        applyTweak(el, next)
        tweaksRef.current = { ...tweaksRef.current, [basePath]: next }
        if (selectedRef.current === el) setForm(next)
        return
      }
      const t = editableTarget(e.target)
      if (!t || t === hoverRef.current || t === selectedRef.current) return
      hoverRef.current?.classList.remove('design-hover')
      hoverRef.current = t
      t.classList.add('design-hover')
    }

    const onDown = (e) => {
      if (isUi(e.target)) return
      const t = editableTarget(e.target)
      if (!t) return
      e.preventDefault()
      e.stopPropagation()
      selectEl(t)
      const p = cssPath(t)
      const cur = tweaksRef.current[p] || computedState(t)
      dragRef.current = {
        el: t,
        startX: e.clientX,
        startY: e.clientY,
        baseX: cur.translateX || 0,
        baseY: cur.translateY || 0,
        basePath: p,
      }
    }

    const onUp = () => {
      if (dragRef.current) {
        writeTweaks(tweaksRef.current)
        dragRef.current = null
      }
    }

    const onClick = (e) => {
      if (isUi(e.target)) return
      e.preventDefault()
      e.stopPropagation()
    }

    document.addEventListener('mousemove', onMove, true)
    document.addEventListener('mousedown', onDown, true)
    document.addEventListener('mouseup', onUp, true)
    document.addEventListener('click', onClick, true)
    return () => {
      document.removeEventListener('mousemove', onMove, true)
      document.removeEventListener('mousedown', onDown, true)
      document.removeEventListener('mouseup', onUp, true)
      document.removeEventListener('click', onClick, true)
    }
  }, [on, selectEl])

  const exportText = useMemo(() => JSON.stringify(tweaksRef.current, null, 2), [form, on])

  const copyExport = async () => {
    const text = JSON.stringify(tweaksRef.current, null, 2)
    try {
      await navigator.clipboard.writeText(text)
      alert('已复制调整数据，可发给我帮你写回正式样式')
    } catch {
      console.log(text)
      alert('复制失败，已打印到控制台')
    }
  }

  const resetSelected = () => {
    const el = selectedRef.current
    if (!el || !path) return
    clearInline(el)
    const next = { ...tweaksRef.current }
    delete next[path]
    tweaksRef.current = next
    writeTweaks(next)
    setForm(computedState(el))
  }

  const resetAll = () => {
    Object.keys(tweaksRef.current).forEach((selector) => {
      document.querySelectorAll(selector).forEach(clearInline)
    })
    tweaksRef.current = {}
    writeTweaks({})
    if (selectedRef.current) setForm(computedState(selectedRef.current))
  }

  return (
    <>
      <button
        type="button"
        className={`design-fab ${on ? 'is-on' : ''}`}
        onClick={() => setOn((v) => !v)}
      >
        {on ? '退出编辑' : '编辑模式'}
      </button>

      {on && (
        <aside className="design-panel" aria-label="设计编辑面板">
          <h3>临时编辑面板</h3>
          {!form ? (
            <p className="design-hint">点击页面文字/标签选中；按住拖动改位置。</p>
          ) : (
            <>
              <p className="design-path">{path}</p>
              <div className="design-row">
                <label>字号</label>
                <input
                  type="range"
                  min="8"
                  max="96"
                  value={form.fontSize}
                  onChange={(e) => commit({ ...form, fontSize: Number(e.target.value) })}
                />
                <input
                  type="number"
                  value={form.fontSize}
                  onChange={(e) => commit({ ...form, fontSize: Number(e.target.value) })}
                />
              </div>
              <div className="design-row">
                <label>X 偏移</label>
                <input
                  type="range"
                  min="-200"
                  max="200"
                  value={form.translateX}
                  onChange={(e) => commit({ ...form, translateX: Number(e.target.value) })}
                />
                <input
                  type="number"
                  value={form.translateX}
                  onChange={(e) => commit({ ...form, translateX: Number(e.target.value) })}
                />
              </div>
              <div className="design-row">
                <label>Y 偏移</label>
                <input
                  type="range"
                  min="-200"
                  max="200"
                  value={form.translateY}
                  onChange={(e) => commit({ ...form, translateY: Number(e.target.value) })}
                />
                <input
                  type="number"
                  value={form.translateY}
                  onChange={(e) => commit({ ...form, translateY: Number(e.target.value) })}
                />
              </div>
              <div className="design-row">
                <label>文字色</label>
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => commit({ ...form, color: e.target.value })}
                />
                <input
                  type="text"
                  value={form.color}
                  onChange={(e) => commit({ ...form, color: e.target.value })}
                />
              </div>
              <div className="design-row">
                <label>背景色</label>
                <input
                  type="color"
                  value={form.backgroundColor}
                  onChange={(e) => commit({ ...form, backgroundColor: e.target.value })}
                />
                <input
                  type="text"
                  value={form.backgroundColor}
                  onChange={(e) => commit({ ...form, backgroundColor: e.target.value })}
                />
              </div>
              <div className="design-actions">
                <button type="button" onClick={resetSelected}>重置当前</button>
                <button type="button" onClick={resetAll}>清空全部</button>
                <button type="button" onClick={copyExport}>复制数据</button>
              </div>
              <p className="design-hint">
                调整会保存在本机。后期删掉编辑模式时，把「复制数据」发给我即可写回正式 CSS。
              </p>
              <pre style={{ display: 'none' }}>{exportText}</pre>
            </>
          )}
        </aside>
      )}
    </>
  )
}
