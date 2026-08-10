import { useEffect, useId, useRef, useState } from 'react'
import MediaShowcase from './MediaShowcase.jsx'
import LazyVideo from './LazyVideo.jsx'

function ExpandShowcase({ project }) {
  return (
    <div className="cross-expand-showcase">
      <MediaShowcase
        slides={project.slides}
        video={project.video}
        title={project.title}
        ratio="4 / 3"
        labelSide="left"
        className="is-car-media"
      />
    </div>
  )
}

function ExpandGallery({ project }) {
  const gallery = (project.gallery || []).filter((src) => src && src !== project.image)
  const singleShot = gallery.length === 1 && !project.video

  return (
    <div
      className={`cross-expand-media ${project.video ? 'has-video' : ''} ${singleShot ? 'is-single' : ''}`}
    >
      <div className="cross-expand-gallery">
        {gallery.map((src, i) => (
          <figure key={src} className="cross-expand-shot">
            <img src={src} alt={`${project.title} ${i + 1}`} loading="lazy" decoding="async" />
          </figure>
        ))}
        {project.video && (
          <div className="cross-expand-video">
            <LazyVideo src={project.video} playLabel="点击播放" className="is-cross-video" />
          </div>
        )}
      </div>
    </div>
  )
}

function ExpandMedia({ project }) {
  if (project.slides?.length) return <ExpandShowcase project={project} />
  return <ExpandGallery project={project} />
}

/** Standalone explanation card — rendered below ScrollStack, not inside pinned cards */
export function CrossExplainCard({ project, panelId }) {
  if (!project) return null
  const hasShowcase = Boolean(project.slides?.length)
  return (
    <div className="cross-explain-card ability-detail cross-detail is-open" id={panelId} aria-hidden={false}>
      <div className={`cross-detail-inner ${hasShowcase ? 'is-showcase' : ''}`}>
        <ExpandMedia project={project} />
        <div className="ability-detail-body">
          <p className="ability-card-field">{project.field}</p>
          <h4 className="ability-detail-title">
            <span className="book-mark" aria-hidden="true">
              《
            </span>
            {String(project.title || '').replace(/^《|》$/g, '')}
            <span className="book-mark" aria-hidden="true">
              》
            </span>
          </h4>
          {project.summary && <p className="ability-summary">{project.summary}</p>}
          {project.detail && (
            <div className="ability-work-block">
              <span className="ability-label">个人贡献：</span>
              <p className="ability-detail-text">{project.detail}</p>
            </div>
          )}
          <ul className="ability-tags">
            {project.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ project, index, isOpen, isLit, panelId, onSelect, onHover }) {
  return (
    <article
      data-project-id={project.id}
      className={`cross-card ${isOpen ? 'is-active' : ''} ${isLit ? 'is-lit' : ''}`}
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      aria-controls={panelId}
      onMouseEnter={() => onHover(project.id)}
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onSelect(project.id)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(project.id)
        }
      }}
    >
      <div className="cross-card-top">
        <span className="cross-card-no">{String(index + 1).padStart(2, '0')}</span>
        <ul className="cross-card-tags">
          {project.tags.slice(0, 3).map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>

      <div className="cross-card-visual">
        <img src={project.image} alt={project.title} loading="lazy" />
      </div>

      <div className="cross-card-body">
        <p className="cross-card-field">{project.field}</p>
        <h4 className="cross-card-title">
          <span className="book-mark" aria-hidden="true">
            《
          </span>
          {String(project.title || '').replace(/^《|》$/g, '')}
          <span className="book-mark" aria-hidden="true">
            》
          </span>
        </h4>
        <p className="cross-card-summary">{project.summary}</p>
        <span className="cross-card-cta" aria-hidden="true">
          <span>↗</span>
        </span>
      </div>
    </article>
  )
}

/**
 * Rail only (lives inside ScrollStack).
 * Detail card is rendered outside via CrossExplainCard + reserved slot.
 */
export default function CrossSlider({ item, activeId, onSelect }) {
  const [hoverId, setHoverId] = useState(null)
  const panelId = useId()
  const rootRef = useRef(null)
  const litId = activeId || hoverId

  useEffect(() => {
    const onOpen = (e) => {
      const id = e.detail?.id
      if (!id) return
      if (item.projects.some((p) => p.id === id)) onSelect(id)
    }
    window.addEventListener('cross:open', onOpen)
    return () => window.removeEventListener('cross:open', onOpen)
  }, [item.projects, onSelect])

  return (
    <article className="ability-gallery cross-slider cross-nesh" id={item.id} data-reveal ref={rootRef}>
      {item.projects.map((p) => (
        <span key={`anchor-${p.id}`} id={p.id} className="cross-anchor" aria-hidden="true" />
      ))}
      <div className="cross-nesh-head">
        <h3 className="ability-title">
          <span className="ability-title-no" aria-hidden="true">
            <span className="ability-title-no-label">POINT</span>
            <span className="ability-title-no-num">
              {String(item.no || '4').replace(/\D/g, '').padStart(2, '0') || '04'}
            </span>
          </span>
          <span className="ability-title-text">{item.title}</span>
        </h3>
      </div>

      <div
        className={`cross-nesh-rail ${litId ? 'is-dimming' : ''}`}
        aria-label={`${item.title}项目列表`}
        onMouseLeave={() => setHoverId(null)}
      >
        {item.projects.map((p, index) => (
          <ProjectCard
            key={p.id}
            project={p}
            index={index}
            isOpen={activeId === p.id}
            isLit={litId === p.id}
            panelId={panelId}
            onHover={setHoverId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </article>
  )
}
