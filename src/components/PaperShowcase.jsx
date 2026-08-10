export default function PaperShowcase({ idea, pdf, title = '' }) {
  return (
    <div className="paper-showcase">
      {idea && (
        <figure className="paper-idea">
          <img src={idea} alt={`${title} · 论文思路`} loading="eager" />
          <figcaption>论文思路</figcaption>
        </figure>
      )}

      {pdf && (
        <a
          className="paper-detail-link"
          href={pdf}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="paper-detail-pulse" aria-hidden="true" />
          点击此处查看详情
          <span aria-hidden="true">→</span>
        </a>
      )}
    </div>
  )
}
