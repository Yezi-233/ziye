import { useEffect, useState } from 'react'
import { site } from '../content/portfolio.js'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeHref, setActiveHref] = useState(site.nav[0]?.href || '')
  const [concealed, setConcealed] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    let ticking = false

    const sync = () => {
      const y = window.scrollY
      setScrolled(y > 24)

      const probe = window.innerHeight * 0.28
      let bestHref = site.nav[0]?.href || ''
      let bestDist = Infinity
      site.nav.forEach((item) => {
        const el = document.getElementById(item.href.replace('#', ''))
        if (!el) return
        const rect = el.getBoundingClientRect()
        if (rect.bottom < 96) return
        const dist = Math.abs(rect.top - probe)
        if (dist < bestDist) {
          bestDist = dist
          bestHref = item.href
        }
      })
      setActiveHref((prev) => (prev === bestHref ? prev : bestHref))

      const overview = document.getElementById('projects-overview')
      const practice = document.getElementById('practice')
      if (overview) {
        const oRect = overview.getBoundingClientRect()
        const pTop = practice?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY
        const entered = oRect.top < window.innerHeight * 0.42
        const beforePractice = pTop > window.innerHeight * 0.42
        const next = entered && beforePractice && oRect.bottom > 120
        setConcealed((prev) => {
          if (prev === next) return prev
          document.documentElement.classList.toggle('nav-concealed', next)
          return next
        })
      }
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        sync()
        ticking = false
      })
    }

    sync()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', sync)
    window.addEventListener('hashchange', sync)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', sync)
      window.removeEventListener('hashchange', sync)
      document.documentElement.classList.remove('nav-concealed')
    }
  }, [])

  return (
    <header
      className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''} ${concealed ? 'is-concealed' : ''}`}
    >
      <div className="container nav-inner">
        <a className="nav-logo" href="#top" onClick={() => setOpen(false)}>
          <span className="nav-logo-mark">LY</span>
          <span className="nav-logo-text">
            {site.name}
            <em>{site.latin}</em>
          </span>
        </a>

        <nav className="nav-links" aria-label="主导航">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={activeHref === item.href ? 'is-active' : ''}
              onClick={() => {
                setActiveHref(item.href)
                setOpen(false)
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <a className="nav-cta" href="#contact" onClick={() => setOpen(false)}>
            {site.cta} <span>→</span>
          </a>
          <button
            className={`nav-burger ${open ? 'is-active' : ''}`}
            aria-label={open ? '关闭菜单' : '打开菜单'}
            onClick={() => setOpen(!open)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className="nav-mobile">
        <nav>
          {site.nav.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              className={activeHref === item.href ? 'is-active' : ''}
              onClick={() => {
                setActiveHref(item.href)
                setOpen(false)
              }}
              style={{ '--i': i }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
