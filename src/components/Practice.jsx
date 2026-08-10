import { useEffect, useId, useState } from 'react'
import { practice as content } from '../content/portfolio.js'

function PracticeDetail({ item, panelId, onClose }) {
  const shots = item.gallery?.length ? item.gallery : item.image ? [item.image] : []

  return (
    <div className="practice-detail is-open" id={panelId} aria-hidden={false}>
      <div className="practice-detail-inner">
        <div className={`practice-detail-media ${shots.length > 1 ? 'is-multi' : ''}`}>
          {shots.map((src, i) => (
            <figure key={src} className="practice-detail-shot">
              <img src={src} alt={`${item.title} ${i + 1}`} loading="lazy" />
            </figure>
          ))}
        </div>
        <div className="practice-detail-body">
          <p className="practice-detail-category">{item.category}</p>
          <h4 className="practice-detail-title">{item.title}</h4>
          <p className="practice-detail-summary">{item.summary}</p>
          <button type="button" className="practice-detail-close" onClick={onClose}>
            收起
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Practice() {
  const [activeId, setActiveId] = useState(null)
  const panelId = useId()
  const active = content.items.find((item) => item.id === activeId) || null

  useEffect(() => {
    if (!active) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setActiveId(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])

  return (
    <section className="section practice" id="practice">
      <div className="container">
        <h2 className="projects-overview-title practice-section-title" data-reveal>
          <span className="projects-overview-title-en">Practice</span>
          <span className="projects-overview-title-zh">{content.title}</span>
        </h2>

        <div className="practice-list" data-reveal>
          {content.items.map((item) => {
            const isOpen = activeId === item.id
            return (
              <div key={item.id} className={`practice-row ${isOpen ? 'is-open' : ''}`}>
                <button
                  type="button"
                  className="practice-strip"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setActiveId(isOpen ? null : item.id)}
                >
                  <span className="practice-strip-title">{item.title}</span>
                  <span className="practice-strip-meta">
                    <span className="practice-strip-category">{item.category}</span>
                    <span className="practice-strip-arrow" aria-hidden="true">
                      {isOpen ? '−' : '+'}
                    </span>
                  </span>
                </button>
                {isOpen && (
                  <PracticeDetail
                    item={active}
                    panelId={panelId}
                    onClose={() => setActiveId(null)}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
