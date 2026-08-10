export default function Marquee({ items }) {
  const row = items.map((t, i) => (
    <span key={i} className="marquee-item">
      {t}<i>✦</i>
    </span>
  ))
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        <div className="marquee-group">{row}</div>
        <div className="marquee-group">{row}</div>
      </div>
    </div>
  )
}