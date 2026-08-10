import { useRef, useEffect, useCallback } from 'react'

const ClickSpark = ({
  sparkColor = '#fff',
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = 'ease-out',
  extraScale = 1.0,
  children,
}) => {
  const canvasRef = useRef(null)
  const sparksRef = useRef([])
  const animationIdRef = useRef(null)
  const easeFunc = useCallback(
    (t) => {
      switch (easing) {
        case 'linear':
          return t
        case 'ease-in':
          return t * t
        case 'ease-in-out':
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
        default:
          return t * (2 - t)
      }
    },
    [easing]
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const parent = canvas.parentElement
    if (!parent) return undefined

    let resizeTimeout
    const resizeCanvas = () => {
      const { width, height } = parent.getBoundingClientRect()
      // Cap canvas resolution — full-page HiDPI canvas is very expensive
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const w = Math.max(1, Math.floor(width * dpr))
      const h = Math.max(1, Math.floor(height * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
    }

    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(resizeCanvas, 120)
    }

    const ro = new ResizeObserver(handleResize)
    ro.observe(parent)
    resizeCanvas()

    return () => {
      ro.disconnect()
      clearTimeout(resizeTimeout)
    }
  }, [])

  const stopLoop = useCallback(() => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current)
      animationIdRef.current = null
    }
  }, [])

  const startLoop = useCallback(() => {
    if (animationIdRef.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const draw = (timestamp) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const dpr = canvas.width / (canvas.getBoundingClientRect().width || 1)

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime
        if (elapsed >= duration) return false

        const progress = elapsed / duration
        const eased = easeFunc(progress)
        const distance = eased * sparkRadius * extraScale * dpr
        const lineLength = sparkSize * (1 - eased) * dpr
        const x = spark.x * dpr
        const y = spark.y * dpr

        const x1 = x + distance * Math.cos(spark.angle)
        const y1 = y + distance * Math.sin(spark.angle)
        const x2 = x + (distance + lineLength) * Math.cos(spark.angle)
        const y2 = y + (distance + lineLength) * Math.sin(spark.angle)

        ctx.strokeStyle = sparkColor
        ctx.lineWidth = Math.max(1.5, 2 * dpr)
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
        return true
      })

      if (sparksRef.current.length > 0) {
        animationIdRef.current = requestAnimationFrame(draw)
      } else {
        animationIdRef.current = null
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }

    animationIdRef.current = requestAnimationFrame(draw)
  }, [duration, easeFunc, sparkRadius, extraScale, sparkSize, sparkColor])

  useEffect(() => () => stopLoop(), [stopLoop])

  const handleClick = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const now = performance.now()

    sparksRef.current.push(
      ...Array.from({ length: sparkCount }, (_, i) => ({
        x,
        y,
        angle: (2 * Math.PI * i) / sparkCount,
        startTime: now,
      }))
    )
    startLoop()
  }

  return (
    <div
      className="click-spark"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100%',
        height: 'auto',
      }}
      onClick={handleClick}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          userSelect: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 9998,
        }}
      />
      {children}
    </div>
  )
}

export default ClickSpark
