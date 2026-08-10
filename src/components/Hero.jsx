import { useState } from 'react'
import { site, hero as content } from '../content/portfolio.js'
import Marquee from './Marquee.jsx'

export default function Hero() {
  const [videoReady, setVideoReady] = useState(false)
  const [videoError, setVideoError] = useState(false)

  return (
    <section className="hero" id="top">
      <div className="hero-fallback" aria-hidden="true">
        <span className="orb orb-1" />
        <span className="orb orb-2" />
        <span className="orb orb-3" />
      </div>
      {!videoError && (
        <video
          className={`hero-video ${videoReady ? 'is-ready' : ''}`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setVideoReady(true)}
          onError={() => setVideoError(true)}
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      )}
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />

      <div className="container hero-inner">
        <p className="hero-eyebrow" data-reveal>{content.eyebrow}</p>

        <p className="hero-brand" data-reveal data-delay="60">
          <span className="hero-brand-zh">{content.brand}</span>
          <span className="hero-brand-en">{content.brandEn}</span>
        </p>

        <h1 className="hero-title" aria-label={`${site.name} — ${site.role.join(' / ')}`}>
          {content.lines.map((line, i) => (
            <span
              key={line.zh}
              className={`h1-line ${line.ghost ? 'is-ghost' : ''}`}
              data-reveal
              data-delay={140 + i * 120}
            >
              {line.zh}
              <em>{line.en}</em>
            </span>
          ))}
        </h1>

        <p className="hero-sub" data-reveal data-delay="520">
          <span className="hero-sub-bar" />
          {content.sub}
        </p>
      </div>

      <div className="container hero-bottom">
        <p className="hero-meta" data-reveal data-delay="580">
          {content.meta.map((m, i) => (
            <span key={m}>
              {i > 0 && <i className="sep">·</i>}
              {m}
            </span>
          ))}
        </p>
        <a className="hero-scroll" href="#about" data-reveal data-delay="620">
          SCROLL
          <span className="hero-scroll-line" />
        </a>
      </div>

      <Marquee items={content.marquee} />
    </section>
  )
}
