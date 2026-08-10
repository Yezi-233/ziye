import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { about, abilities as content, site } from '../content/portfolio.js'
import Placeholder from './Placeholder.jsx'
import MediaShowcase from './MediaShowcase.jsx'
import PaperShowcase from './PaperShowcase.jsx'
import CrossSlider, { CrossExplainCard } from './CrossSlider.jsx'
import SimModule from './SimModule.jsx'
import Magnet from './Magnet.jsx'
import ScrollStack, { ScrollStackItem } from './ScrollStack.jsx'

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

function AbilityTitle({ no, title }) {
  const num = String(no || '1').replace(/\D/g, '').padStart(2, '0') || '01'
  return (
    <h3 className="ability-title">
      <span className="ability-title-no" aria-hidden="true">
        <span className="ability-title-no-label">POINT</span>
        <span className="ability-title-no-num">{num}</span>
      </span>
      <span className="ability-title-text">{title}</span>
    </h3>
  )
}

function FeaturedBlock({ item }) {
  const p = item.project
  const hasPaper = Boolean(p.paperIdea || p.paperPdf)
  const hasShowcase = Boolean(p.slides?.length || p.video)

  if (item.layout === 'sim-module') {
    return <SimModule item={item} />
  }

  return (
    <article
      className={`ability-featured ${item.reverse ? 'is-reverse' : ''} ${hasShowcase || hasPaper ? 'has-showcase' : ''}`}
      id={item.id}
      data-reveal
    >
      <div className="ability-featured-media">
        {hasPaper ? (
          <PaperShowcase
            idea={p.paperIdea}
            pdf={p.paperPdf}
            title={p.title}
          />
        ) : hasShowcase ? (
          <MediaShowcase slides={p.slides || []} video={p.video} title={p.title} />
        ) : (
          <Placeholder
            src={p.image}
            alt={p.title}
            ratio="4 / 3"
            hue={item.hue}
            label={p.title}
            hint={p.galleryHint}
          />
        )}
      </div>
      <div className="ability-featured-body">
        <AbilityTitle no={item.no} title={item.title} />
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

function NavIcon({ index }) {
  const paths = [
    'M4 14h8v2H4zm0-4h12v2H4zm0-4h16v2H4z',
    'M12 3l7 4v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4z',
    'M4 16l4-8 4 5 3-4 5 7H4z',
    'M12 5c-2 3-5 5-5 8a5 5 0 0010 0c0-3-3-5-5-8z',
    'M7 7h10v2H7zm0 4h10v2H7zm2 4h6v2H9z',
    'M5 12a7 7 0 1114 0 7 7 0 01-14 0zm7-3v6m-3-3h6',
    'M8 6h8v3H8zm0 5h8v7H8z',
  ]
  return (
    <span className="psn-link-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
        <path d={paths[index % paths.length]} />
      </svg>
    </span>
  )
}

export default function Abilities() {
  const [activeTagId, setActiveTagId] = useState(null)
  const [activeSection, setActiveSection] = useState('')
  const [copied, setCopied] = useState(false)
  const [crossActiveId, setCrossActiveId] = useState(null)
  const overviewRef = useRef(null)
  const activeLockUntil = useRef(0)
  const activeTag = content.jumpTags.find((t) => t.id === activeTagId && t.detail) || null
  const sideNavLinks = content.sideNav
  const crossItem = useMemo(
    () => content.items.find((item) => item.layout === 'gallery') || null,
    []
  )
  const crossActive = useMemo(
    () => crossItem?.projects.find((p) => p.id === crossActiveId) || null,
    [crossItem, crossActiveId]
  )
  const selectCrossProject = useCallback((id) => {
    if (!id) return
    setCrossActiveId(id)
  }, [])

  useEffect(() => {
    if (!crossActiveId) return undefined

    const onPointerDown = (e) => {
      const t = e.target
      if (!(t instanceof Element)) return
      // Keep open when interacting with last-card project rail or the explain card
      if (t.closest('.cross-nesh') || t.closest('.cross-explain-card')) return
      setCrossActiveId(null)
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [crossActiveId])

  const national = useMemo(
    () => about.stats.find((s) => s.label.includes('国家')) || { value: '3', label: '国家级奖项' },
    []
  )
  const provincial = useMemo(
    () => about.stats.find((s) => s.label.includes('省级')) || { value: '7', label: '省级奖项' },
    []
  )

  useEffect(() => {
    if (!activeTag) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setActiveTagId(null)
    }
    const onPointerDown = (e) => {
      const t = e.target
      if (!(t instanceof Element)) return
      if (t.closest('.abilities-orbit-pop') || t.closest('.abilities-orbit-item.is-info')) return
      setActiveTagId(null)
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [activeTag])

  useEffect(() => {
    const ids = sideNavLinks.map((t) => t.href.replace('#', ''))

    const syncFromHash = () => {
      const hash = window.location.hash.replace('#', '')
      if (ids.includes(hash)) setActiveSection(hash)
    }
    syncFromHash()
    window.addEventListener('hashchange', syncFromHash)

    let ticking = false
    const pickActive = () => {
      if (Date.now() < activeLockUntil.current) return
      const mid = window.innerHeight * 0.38
      let bestId = ''
      let bestDist = Infinity
      ids.forEach((id) => {
        const el = document.getElementById(id)
        if (!el) return
        const rect = el.getBoundingClientRect()
        if (rect.bottom < 72 || rect.top > window.innerHeight - 48) return
        const dist = Math.abs(rect.top + Math.min(rect.height * 0.25, 80) - mid)
        if (dist < bestDist) {
          bestDist = dist
          bestId = id
        }
      })
      if (bestId) setActiveSection((prev) => (prev === bestId ? prev : bestId))
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        pickActive()
        ticking = false
      })
    }

    pickActive()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', pickActive)
    return () => {
      window.removeEventListener('hashchange', syncFromHash)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', pickActive)
    }
  }, [sideNavLinks])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      /* ignore */
    }
  }

  const CROSS_PROJECT_IDS = useMemo(
    () => new Set(['frog', 'car', 'dust', 'nozzle']),
    []
  )

  const onNavClick = (e, href) => {
    e.preventDefault()
    e.stopPropagation()

    const id = href.replace('#', '')
    setActiveSection(id)
    activeLockUntil.current = Date.now() + 1200

    const targetId = CROSS_PROJECT_IDS.has(id) ? 'cross' : id
    const el = document.getElementById(targetId)
    if (!el) return

    const stackCard = el.closest('.scroll-stack-card')
    const wrap = stackCard?.parentElement
    const stackPos = 52
    if (wrap) {
      const wrappers = Array.from(
        document.querySelectorAll('.projects-scroll-stack .scroll-stack-card-wrapper')
      )
      const index = Math.max(0, wrappers.indexOf(wrap))
      const top = wrap.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: Math.max(0, top - stackPos - index * 18),
        behavior: 'smooth',
      })
    } else {
      const top = el.getBoundingClientRect().top + window.scrollY - 84
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
    }

    if (CROSS_PROJECT_IDS.has(id)) {
      window.setTimeout(() => {
        window.dispatchEvent(new CustomEvent('cross:open', { detail: { id } }))
      }, 320)
    }
  }

  return (
    <>
      <section className="section abilities" id="abilities">
        <div className="container">
            <div className="abilities-head" data-reveal>
              <div className="abilities-orbit-core">
                <h2 className="abilities-orbit-title">{content.title}</h2>
              </div>
              <ul className="abilities-orbit" aria-label="能力导航">
                {content.jumpTags.map((tag, i) => (
                  <li
                    key={tag.id}
                    className={`abilities-orbit-item is-${i} ${tag.href ? 'is-link' : 'is-info'}`}
                  >
                    <Magnet padding={50} disabled={false} magnetStrength={50}>
                      {tag.href ? (
                        <a href={tag.href}>{tag.label}</a>
                      ) : (
                        <button
                          type="button"
                          className={activeTagId === tag.id ? 'is-open' : ''}
                          aria-expanded={activeTagId === tag.id}
                          onClick={() => setActiveTagId(activeTagId === tag.id ? null : tag.id)}
                        >
                          {tag.label}
                        </button>
                      )}
                    </Magnet>
                  </li>
                ))}
              </ul>

              {activeTag && (
                <div className="abilities-orbit-pop" role="dialog" aria-label={activeTag.label}>
                  <p className="abilities-orbit-pop-title">{activeTag.label}</p>
                  <p className="abilities-orbit-pop-text">{activeTag.detail}</p>
                </div>
              )}
            </div>
          </div>
      </section>

      <section
        className="section projects-overview has-side-nav"
        id="projects-overview"
        ref={overviewRef}
      >
        <div className="projects-overview-layout">
          <aside className="projects-side-nav is-visible" aria-label="项目能力导航">
            <div className="psn-stack">
              <div className="psn-card psn-profile">
                <div className="psn-profile-top">
                  <span className="psn-name">{site.name}</span>
                  <a
                    className="psn-mail-btn"
                    href="#contact"
                    aria-label="前往联系方式"
                    title="联系方式"
                  >
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
                      <rect x="3.5" y="5.5" width="17" height="13" rx="2.2" stroke="currentColor" strokeWidth="1.7" />
                      <path d="M4.5 7.5L12 13.2 19.5 7.5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
                <p className="psn-intro">{content.sideIntro}</p>
              </div>

              <div className="psn-card psn-stats">
                <div className="psn-stat">
                  <strong>{national.value}</strong>
                  <span>国奖</span>
                </div>
                <div className="psn-stat">
                  <strong>{provincial.value}</strong>
                  <span>省奖</span>
                </div>
              </div>

              <div className="psn-card psn-menu">
                <span className="psn-menu-title">项目概述</span>
                <ul className="psn-menu-list">
                  {sideNavLinks.map((link, i) => {
                    const id = link.href.replace('#', '')
                    return (
                      <li key={link.id}>
                        <a
                          href={link.href}
                          className={activeSection === id ? 'is-active' : ''}
                          onClick={(e) => onNavClick(e, link.href)}
                        >
                          <NavIcon index={i} />
                          <span>{link.label}</span>
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </div>

              <div className="psn-card psn-email">
                <span className="psn-email-text">{site.email}</span>
                <button type="button" className="psn-email-copy" onClick={copyEmail}>
                  {copied ? '已复制' : '复制'}
                </button>
              </div>

              <a href="#about" className="psn-cta">
                关于我
              </a>
            </div>
          </aside>

          <div className="container projects-overview-main">
            <h2 className="projects-overview-title" data-reveal>
              <span className="projects-overview-title-en">Projects</span>
              <span className="projects-overview-title-zh">{content.overviewTitle}</span>
            </h2>
            <ScrollStack
              className="projects-scroll-stack"
              useWindowScroll
              itemDistance={20}
              itemStackDistance={18}
              stackPosition="52px"
              scaleEndPosition="28px"
              baseScale={0.95}
              itemScale={0.012}
              blurAmount={0}
            >
              {content.items.map((item, index) => (
                <ScrollStackItem
                  key={item.id}
                  itemClassName={`projects-overview-panel is-tone-${index % 2 === 0 ? 'sky' : 'glacier'}`}
                >
                  {item.layout === 'gallery' ? (
                    <CrossSlider
                      item={item}
                      activeId={crossActiveId}
                      onSelect={selectCrossProject}
                    />
                  ) : (
                    <FeaturedBlock item={item} />
                  )}
                </ScrollStackItem>
              ))}
            </ScrollStack>

            {/* Reserved below last stack card: explanation stays outside pin transforms */}
            <div className="cross-explain-slot" aria-live="polite">
              {crossActive ? (
                <CrossExplainCard project={crossActive} />
              ) : (
                <div className="cross-explain-reserve" aria-hidden="true" />
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
