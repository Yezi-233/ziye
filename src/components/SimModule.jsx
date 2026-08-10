import MediaShowcase from './MediaShowcase.jsx'

function ProjectTitle({ title }) {
  const text = String(title || '').replace(/^《+|》+$/g, '')
  return (
    <p className="ability-project-title">
      <span className="book-mark">《</span>
      {text}
      <span className="book-mark">》</span>
    </p>
  )
}

export default function SimModule({ item }) {
  const p = item.project
  const slides = p.slides || []
  const overview = p.overview

  return (
    <article className="ability-featured has-showcase ability-sim-featured" id={item.id} data-reveal>
      <div className="ability-featured-media">
        <MediaShowcase slides={slides} title={p.title} />
        {overview?.src && (
          <figure className="ability-sim-overview">
            <img src={overview.src} alt={overview.label || '整体概括图'} loading="lazy" />
            <figcaption className="media-slide-label">
              {overview.label || '整体概括图'}
            </figcaption>
          </figure>
        )}
      </div>
      <div className="ability-featured-body">
        <h3 className="ability-title">
          <span className="ability-title-no" aria-hidden="true">
            <span className="ability-title-no-label">POINT</span>
            <span className="ability-title-no-num">
              {String(item.no || '3').replace(/\D/g, '').padStart(2, '0') || '03'}
            </span>
          </span>
          <span className="ability-title-text">{item.title}</span>
        </h3>
        <div className="ability-featured-copy">
          <ProjectTitle title={p.title} />
          {p.award && <p className="ability-award">{p.award}</p>}
          {p.summary && <p className="ability-summary">{p.summary}</p>}
          {p.work?.length > 0 && (
            <div className="ability-work-block">
              <span className="ability-label">个人贡献：</span>
              <ul className="ability-work">
                {p.work.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          )}
          <ul className="ability-tags">
            {p.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  )
}
