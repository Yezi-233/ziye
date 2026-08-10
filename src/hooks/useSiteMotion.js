import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const EASE = 'power3.out'
const EASE_SOFT = 'power2.inOut'

/**
 * Premium site motion: opening sequence + scroll-triggered section reveals.
 * Uses transform / opacity / clip-path only for smoother GPU work.
 */
export default function useSiteMotion() {
  useEffect(() => {
    const reduced =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(max-width: 860px)').matches
    document.documentElement.classList.add('gsap-ready')
    if (reduced) document.documentElement.classList.add('motion-lite')
    else document.documentElement.classList.remove('motion-lite')
    const ctx = gsap.context(() => {
      // Neutralize legacy fade so GSAP owns the reveal
      gsap.set('[data-reveal]', { clearProps: 'transition' })

      if (reduced) {
        gsap.set(
          [
            '.about-left',
            '.about-title',
            '.about-tags',
            '.about-text',
            '.about-skills',
            '.about-awards',
            '.stat',
            '.nav',
            '.projects-overview-title-en',
            '.projects-overview-title-zh',
            '.scroll-stack-card',
            '.cross-explain-slot',
            '.practice-list .practice-row',
            '.abilities-orbit-item',
            '.abilities-orbit-title',
            '.awards-title',
            '.awards-marquee',
            '.media-carousel',
            '.ability-featured-media',
            '.portrait-frame',
          ],
          { opacity: 1, clearProps: 'transform,clipPath,filter' }
        )
        document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'))
        return
      }

      // ---------- Opening (about = first screen) ----------
      const opening = gsap.timeline({
        defaults: { ease: EASE },
        delay: 0.08,
      })

      opening
        .fromTo(
          '.nav',
          { y: -28, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.05, ease: EASE_SOFT },
          0
        )
        .fromTo(
          '.portrait-frame',
          {
            clipPath: 'inset(12% 12% 12% 12% round 24px)',
            scale: 1.08,
            opacity: 0.35,
          },
          {
            clipPath: 'inset(0% 0% 0% 0% round 24px)',
            scale: 1,
            opacity: 1,
            duration: 1.45,
          },
          0.12
        )
        .fromTo(
          '.about-title',
          {
            y: 72,
            scaleY: 1.45,
            transformOrigin: '50% 100%',
            clipPath: 'inset(100% 0 0 0)',
            opacity: 0.35,
          },
          {
            y: 0,
            scaleY: 1,
            clipPath: 'inset(0% 0 0 0)',
            opacity: 1,
            duration: 1.45,
          },
          0.22
        )
        .fromTo(
          '.about-title-motto',
          { y: 28, opacity: 0, letterSpacing: '0.28em' },
          { y: 0, opacity: 1, letterSpacing: '0.06em', duration: 1.1 },
          0.55
        )
        .fromTo(
          '.about-tags li',
          { y: 36, opacity: 0, rotateX: -28 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.95,
            stagger: 0.09,
            transformOrigin: '50% 100%',
          },
          0.62
        )
        .fromTo(
          '.about-text',
          { y: 42, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.05, stagger: 0.14 },
          0.78
        )
        .fromTo(
          '.about-skills',
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.05 },
          1.05
        )
        .fromTo(
          '.about-awards-title',
          { y: 30, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
          { y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.05 },
          1.15
        )
        .fromTo(
          '.about-awards .stat',
          { y: 48, opacity: 0, scale: 0.92 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.05,
            stagger: 0.11,
          },
          1.28
        )

      gsap.set('.about-left, .about-core, .about-awards', { opacity: 1 })
      document.querySelectorAll('#about [data-reveal]').forEach((el) => el.classList.add('is-visible'))

      // ---------- Awards marquee band ----------
      gsap.fromTo(
        '.awards-title',
        { y: 40, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
        {
          y: 0,
          opacity: 1,
          clipPath: 'inset(0 0 0% 0)',
          duration: 1.2,
          ease: EASE,
          scrollTrigger: {
            trigger: '.awards',
            start: 'top 78%',
            once: true,
          },
        }
      )
      gsap.fromTo(
        '.awards-marquee',
        { y: 56, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.35,
          ease: EASE,
          scrollTrigger: {
            trigger: '.awards',
            start: 'top 72%',
            once: true,
          },
        }
      )

      // ---------- Abilities orbit ----------
      gsap.fromTo(
        '.abilities-orbit-title',
        {
          y: 36,
          opacity: 0.35,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: EASE,
          clearProps: 'transform',
          scrollTrigger: {
            trigger: '#abilities',
            start: 'top 70%',
            once: true,
          },
        }
      )
      // Animate opacity only — avoid transform on positioned orbit nodes (keeps ellipse centered)
      gsap.fromTo(
        '.abilities-orbit-item',
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.9,
          stagger: 0.06,
          ease: EASE,
          clearProps: 'transform',
          scrollTrigger: {
            trigger: '#abilities',
            start: 'top 62%',
            once: true,
          },
        }
      )

      // ---------- Projects overview ----------
      const projectsSection = document.querySelector('#projects-overview')
      if (projectsSection) {
        gsap.fromTo(
          projectsSection.querySelector('.projects-overview-title-en'),
          {
            yPercent: 140,
            skewY: 6,
            opacity: 0,
            transformOrigin: 'left bottom',
          },
          {
            yPercent: 0,
            skewY: 0,
            opacity: 1,
            duration: 1.35,
            ease: EASE,
            scrollTrigger: {
              trigger: projectsSection,
              start: 'top 72%',
              once: true,
            },
          }
        )
        gsap.fromTo(
          projectsSection.querySelector('.projects-overview-title-zh'),
          {
            y: 64,
            clipPath: 'inset(100% 0 0 0)',
            opacity: 0.35,
          },
          {
            y: 0,
            clipPath: 'inset(0% 0 0 0)',
            opacity: 1,
            duration: 1.3,
            delay: 0.12,
            ease: EASE,
            scrollTrigger: {
              trigger: projectsSection,
              start: 'top 72%',
              once: true,
            },
          }
        )

        gsap.utils.toArray('.projects-scroll-stack .scroll-stack-card').forEach((card, i) => {
          gsap.fromTo(
            card,
            { y: 90, opacity: 0, rotateX: 6, transformOrigin: '50% 0%' },
            {
              y: 0,
              opacity: 1,
              rotateX: 0,
              duration: 1.25,
              delay: 0.08 * i,
              ease: EASE,
              scrollTrigger: {
                trigger: card,
                start: 'top 86%',
                once: true,
              },
            }
          )

          const media = card.querySelectorAll(
            '.media-carousel, .ability-featured-media, .paper-showcase, .ability-sim-overview'
          )
          media.forEach((el) => {
            gsap.fromTo(
              el,
              { clipPath: 'inset(14% 0 14% 0)', y: 28, opacity: 0.55 },
              {
                clipPath: 'inset(0% 0 0% 0)',
                y: 0,
                opacity: 1,
                duration: 1.25,
                ease: EASE,
                scrollTrigger: {
                  trigger: el,
                  start: 'top 88%',
                  once: true,
                },
              }
            )
          })
        })

        gsap.fromTo(
          '.cross-explain-slot',
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.15,
            ease: EASE,
            scrollTrigger: {
              trigger: '.cross-explain-slot',
              start: 'top 90%',
              once: true,
            },
          }
        )
      }

      // ---------- Practice ----------
      const practice = document.querySelector('#practice')
      if (practice) {
        gsap.fromTo(
          practice.querySelector('.projects-overview-title-en'),
          { yPercent: 140, skewY: 5, opacity: 0 },
          {
            yPercent: 0,
            skewY: 0,
            opacity: 1,
            duration: 1.3,
            ease: EASE,
            scrollTrigger: { trigger: practice, start: 'top 74%', once: true },
          }
        )
        gsap.fromTo(
          practice.querySelector('.projects-overview-title-zh'),
          { y: 56, clipPath: 'inset(100% 0 0 0)', opacity: 0.4 },
          {
            y: 0,
            clipPath: 'inset(0% 0 0 0)',
            opacity: 1,
            duration: 1.25,
            ease: EASE,
            scrollTrigger: { trigger: practice, start: 'top 74%', once: true },
          }
        )
        gsap.fromTo(
          practice.querySelectorAll('.practice-row'),
          { y: 42, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.05,
            stagger: 0.1,
            ease: EASE,
            scrollTrigger: { trigger: practice.querySelector('.practice-list'), start: 'top 82%', once: true },
          }
        )
      }

      // ---------- Contact ----------
      const contact = document.querySelector('#contact')
      if (contact) {
        const contactBits = contact.querySelectorAll(
          '.contact-inner, .contact-title, .contact-card, .contact-bee, [data-reveal]'
        )
        if (contactBits.length) {
          gsap.fromTo(
            contactBits,
            { y: 36, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.05,
              stagger: 0.08,
              ease: EASE,
              scrollTrigger: { trigger: contact, start: 'top 78%', once: true },
            }
          )
        }
      }

      // Mark remaining data-reveal visible after their section plays (safety)
      ScrollTrigger.batch('[data-reveal]:not(.is-visible)', {
        start: 'top 90%',
        once: true,
        onEnter: (batch) => batch.forEach((el) => el.classList.add('is-visible')),
      })
    })

    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)

    // Refresh after fonts/images settle
    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 600)

    return () => {
      window.clearTimeout(refreshTimer)
      window.removeEventListener('resize', onResize)
      document.documentElement.classList.remove('gsap-ready')
      ctx.revert()
    }
  }, [])
}
