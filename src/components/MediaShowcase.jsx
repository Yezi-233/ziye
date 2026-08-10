import { useEffect, useState } from 'react'
import LazyVideo from './LazyVideo.jsx'

export default function MediaShowcase({
  slides = [],
  video,
  title = '',
  ratio = '4 / 3',
  labelSide = 'left',
  className = '',
}) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [inView, setInView] = useState(true)
  const [rootEl, setRootEl] = useState(null)
  const count = slides.length
  const active = slides[index]
  const hasHover = Boolean(active?.hoverHtml)

  useEffect(() => {
    if (!rootEl || typeof IntersectionObserver === 'undefined') return undefined
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio > 0.15),
      { threshold: [0, 0.15, 0.4] }
    )
    io.observe(rootEl)
    return () => io.disconnect()
  }, [rootEl])

  useEffect(() => {
    if (count < 2 || playing || hovering || !inView) return undefined
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % count)
    }, 2200)
    return () => window.clearInterval(timer)
  }, [count, playing, hovering, inView])

  return (
    <div
      ref={setRootEl}
      className={`media-showcase ${className}`.trim()}
      style={{ '--media-ratio': ratio }}
    >
      {count > 0 && (
        <div
          className={`media-carousel ${hovering && hasHover ? 'is-hovering' : ''}`}
          aria-roledescription="carousel"
          aria-label={`${title}图片轮播`}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <div className="media-carousel-viewport">
            {slides.map((slide, i) => {
              const near = Math.abs(i - index) <= 1 || (index === 0 && i === count - 1) || (index === count - 1 && i === 0)
              return (
                <figure
                  key={slide.src}
                  className={`media-slide ${i === index ? 'is-active' : ''}`}
                  aria-hidden={i !== index}
                >
                  {near ? (
                    <img
                      src={slide.src}
                      alt={slide.label || `${title} ${i + 1}`}
                      loading={i === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                  ) : (
                    <div className="media-slide-placeholder" aria-hidden="true" />
                  )}
                  {slide.label && i === index && (
                    <figcaption className={`media-slide-label is-${labelSide}`}>
                      {slide.label}
                    </figcaption>
                  )}
                  {slide.hoverHtml && i === index && (
                    <div className="media-slide-hover" aria-hidden={!hovering}>
                      <p
                        className="media-slide-hover-text"
                        dangerouslySetInnerHTML={{ __html: slide.hoverHtml }}
                      />
                    </div>
                  )}
                </figure>
              )
            })}
          </div>
          {count > 1 && (
            <div className="media-dots" role="tablist" aria-label="轮播指示">
              {slides.map((slide, i) => (
                <button
                  key={slide.src}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  className={i === index ? 'is-active' : ''}
                  aria-label={slide.label || `第 ${i + 1} 张`}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {video && (
        <div className={`media-video ${playing ? 'is-playing' : ''}`}>
          <LazyVideo
            src={video}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
          />
        </div>
      )}
    </div>
  )
}
