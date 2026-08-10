import { useEffect, useState } from 'react'

export default function FocusCarousel({ items = [] }) {
  const [active, setActive] = useState(0)
  const [hovered, setHovered] = useState(null)
  const count = items.length

  useEffect(() => {
    if (count < 2 || hovered !== null) return undefined
    const timer = window.setInterval(() => {
      setActive((i) => (i + 1) % count)
    }, 4200)
    return () => window.clearInterval(timer)
  }, [count, hovered])

  if (!count) return null

  const getOffset = (i) => {
    let d = i - active
    if (d > count / 2) d -= count
    if (d < -count / 2) d += count
    return d
  }

  return (
    <div className="focus-carousel" onMouseLeave={() => setHovered(null)}>
      <div className="focus-track" aria-roledescription="carousel">
        {items.map((item, i) => {
          const offset = getOffset(i)
          const abs = Math.abs(offset)
          const visible = abs <= 1 || count <= 3
          return (
            <button
              type="button"
              key={item.src}
              className={`focus-card ${offset === 0 ? 'is-active' : ''} ${visible ? 'is-visible' : 'is-hidden'}`}
              style={{
                '--offset': offset,
                '--abs': abs,
                zIndex: 10 - abs,
              }}
              onClick={() => setActive(i)}
              onMouseEnter={() => setHovered(i)}
              aria-label={`图${item.no} ${item.title}`}
              aria-current={offset === 0 ? 'true' : undefined}
            >
              <span className="focus-no">{item.no}</span>
              <img src={item.src} alt={item.title} loading={abs <= 1 ? 'eager' : 'lazy'} />
            </button>
          )
        })}
      </div>

      <div
        className={`focus-caption ${hovered !== null ? 'is-open' : ''}`}
        aria-live="polite"
        aria-hidden={hovered === null}
      >
        {hovered !== null && (
          <>
            <h4>
              <em>图{items[hovered].no}</em>
              {items[hovered].title}
            </h4>
            <p>{items[hovered].desc}</p>
          </>
        )}
      </div>

      <div className="focus-dots" role="tablist" aria-label="仿真图切换">
        {items.map((item, i) => (
          <button
            key={item.src}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={i === active ? 'is-active' : ''}
            onClick={() => setActive(i)}
          />
        ))}
      </div>
    </div>
  )
}
