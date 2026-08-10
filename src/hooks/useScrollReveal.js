import { useEffect } from 'react'

// 滚动进入视口时给 [data-reveal] 元素添加 .is-visible
// 支持 data-delay="120" 作为毫秒级过渡延迟
export default function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    els.forEach((el) => {
      const delay = el.getAttribute('data-delay')
      if (delay != null && delay !== '') {
        el.style.setProperty('--delay', `${delay}ms`)
      }
    })

    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}
