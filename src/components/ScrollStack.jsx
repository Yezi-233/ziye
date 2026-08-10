import { useLayoutEffect, useRef, useCallback, Children, cloneElement, isValidElement } from 'react'
import './ScrollStack.css'

export const ScrollStackItem = ({ children, itemClassName = '' }) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
)

const ScrollStack = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = true,
  onStackComplete,
}) => {
  const scrollerRef = useRef(null)
  const stackCompletedRef = useRef(false)
  const animationFrameRef = useRef(null)
  const cardsRef = useRef([])
  const cardTopsRef = useRef([])
  const cardHeightsRef = useRef([])
  const endTopRef = useRef(0)
  const lastTransformsRef = useRef(new Map())
  const isUpdatingRef = useRef(false)

  const calculateProgress = useCallback((scrollTop, start, end) => {
    if (scrollTop < start) return 0
    if (scrollTop > end) return 1
    return (scrollTop - start) / (end - start)
  }, [])

  const parsePercentage = useCallback((value, containerHeight) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight
    }
    return parseFloat(value)
  }, [])

  const measureLayout = useCallback(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const wrappers = Array.from(scroller.querySelectorAll('.scroll-stack-card-wrapper'))
    const cards = wrappers
      .map((wrap) => wrap.querySelector('.scroll-stack-card'))
      .filter(Boolean)

    cardsRef.current = cards

    // Wrappers are not transformed — safe to measure without clearing card transforms
    // (clearing transforms caused cards to jump out of view / appear "empty")
    cardTopsRef.current = wrappers.map((wrap) => {
      const rect = wrap.getBoundingClientRect()
      return rect.top + window.scrollY
    })
    cardHeightsRef.current = cards.map((card) => card.offsetHeight || 0)

    const endEl = scroller.querySelector('.scroll-stack-end')
    if (endEl) {
      const rect = endEl.getBoundingClientRect()
      endTopRef.current = rect.top + window.scrollY
    }

    cards.forEach((card, i) => {
      card.style.marginBottom = i < cards.length - 1 ? `${itemDistance}px` : '0px'
    })
  }, [itemDistance])

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return
    isUpdatingRef.current = true

    const scrollTop = window.scrollY
    const containerHeight = window.innerHeight
    const stackPositionPx = parsePercentage(stackPosition, containerHeight)
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight)

    const last = cardsRef.current.length - 1
    const lastTop = cardTopsRef.current[last] ?? endTopRef.current
    const lastHeight = cardHeightsRef.current[last] || 0

    const pinEnd = Math.min(
      endTopRef.current - containerHeight * 0.75,
      lastTop + Math.max(lastHeight * 0.7, 320) - stackPositionPx
    )

    const pastSection = scrollTop + stackPositionPx >= endTopRef.current - 8

    cardsRef.current.forEach((card, i) => {
      if (!card) return

      const cardTop = cardTopsRef.current[i] ?? 0
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i
      const triggerEnd = cardTop - scaleEndPositionPx
      const pinStart = triggerStart

      const scaleProgress = pastSection
        ? 1
        : calculateProgress(scrollTop, triggerStart, triggerEnd)
      const targetScale = baseScale + i * itemScale
      const scale = 1 - scaleProgress * (1 - targetScale)
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0

      let blur = 0
      if (blurAmount && !pastSection) {
        let topCardIndex = 0
        for (let j = 0; j < cardsRef.current.length; j++) {
          const jCardTop = cardTopsRef.current[j] ?? 0
          const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j
          if (scrollTop >= jTriggerStart) topCardIndex = j
        }
        if (i < topCardIndex) blur = Math.max(0, (topCardIndex - i) * blurAmount)
      }

      let translateY = 0
      if (!pastSection && scrollTop >= pinStart && scrollTop <= pinEnd) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i
      } else if (!pastSection && scrollTop > pinEnd) {
        const pinnedY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i
        const releaseSpan = Math.max(120, containerHeight * 0.35)
        const t = Math.min(1, (scrollTop - pinEnd) / releaseSpan)
        translateY = pinnedY * (1 - t)
      }

      const newTransform = {
        translateY: Math.round(translateY),
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 10) / 10,
        blur: Math.round(blur * 10) / 10,
      }

      const lastTransform = lastTransformsRef.current.get(i)
      const hasChanged =
        !lastTransform ||
        lastTransform.translateY !== newTransform.translateY ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.002 ||
        lastTransform.rotation !== newTransform.rotation ||
        lastTransform.blur !== newTransform.blur

      if (hasChanged) {
        card.style.transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`
        if (blurAmount) {
          card.style.filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : 'none'
        }
        lastTransformsRef.current.set(i, newTransform)
      }

      if (i === last) {
        const isInView = !pastSection && scrollTop >= pinStart && scrollTop <= pinEnd
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true
          onStackComplete?.()
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false
        }
      }
    })

    isUpdatingRef.current = false
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    onStackComplete,
    calculateProgress,
    parsePercentage,
  ])

  useLayoutEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return undefined

    const transformsCache = lastTransformsRef.current
    let ticking = false
    let measureTimer = 0

    const remasureNow = () => {
      window.clearTimeout(measureTimer)
      measureLayout()
      updateCardTransforms()
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      animationFrameRef.current = requestAnimationFrame(() => {
        updateCardTransforms()
        ticking = false
      })
    }

    const scheduleMeasure = () => {
      window.clearTimeout(measureTimer)
      measureTimer = window.setTimeout(remasureNow, 48)
    }

    measureLayout()
    updateCardTransforms()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', remasureNow)
    scroller.addEventListener('scrollstack:remeasure', remasureNow)

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(scheduleMeasure) : null
    ro?.observe(scroller)
    cardsRef.current.forEach((card) => ro?.observe(card))

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', remasureNow)
      scroller.removeEventListener('scrollstack:remeasure', remasureNow)
      window.clearTimeout(measureTimer)
      ro?.disconnect()
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      stackCompletedRef.current = false
      cardsRef.current = []
      transformsCache.clear()
      isUpdatingRef.current = false
    }
  }, [measureLayout, updateCardTransforms, children])

  return (
    <div
      className={`scroll-stack-scroller ${useWindowScroll ? 'is-window-scroll' : ''} ${className}`.trim()}
      ref={scrollerRef}
    >
      <div className="scroll-stack-inner">
        {Children.map(children, (child) => {
          if (!isValidElement(child)) return child
          return <div className="scroll-stack-card-wrapper">{cloneElement(child)}</div>
        })}
        <div className="scroll-stack-end" />
      </div>
    </div>
  )
}

export default ScrollStack
