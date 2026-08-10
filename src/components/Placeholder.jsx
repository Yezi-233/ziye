import { useState } from 'react'

// 图片占位组件：文件存在则显示图片，否则显示设计好的占位视觉
export default function Placeholder({ src, alt = '', ratio = '4 / 3', hue = 60, label = '作品图', hint = '', tone = 'color' }) {
  const [failed, setFailed] = useState(false)
  const showImg = src && !failed

  if (showImg) {
    return (
      <div className="ph-frame" style={{ aspectRatio: ratio }}>
        <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
      </div>
    )
  }

  return (
    <div
      className={`ph ${tone === 'mono' ? 'ph-mono' : ''}`}
      style={{ aspectRatio: ratio, '--hue': hue }}
    >
      <span className="ph-grid" aria-hidden="true" />
      <span className="ph-index">◍</span>
      <span className="ph-label">{label}</span>
      <span className="ph-hint">待替换图片{hint ? ` · ${hint}` : ''}</span>
    </div>
  )
}