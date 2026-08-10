import { useRef, useState } from 'react'

/**
 * Lazy video: do not attach src until the user clicks play.
 * Prevents multi‑MB / 90MB+ mp4 from downloading on first paint.
 */
export default function LazyVideo({
  src,
  className = '',
  poster,
  onPlay,
  onPause,
  onEnded,
  controls = false,
  playLabel = '点击播放运动演示',
}) {
  const videoRef = useRef(null)
  const [armed, setArmed] = useState(false)
  const [playing, setPlaying] = useState(false)

  const play = async () => {
    const el = videoRef.current
    if (!el || !src) return
    if (!armed) {
      el.src = src
      el.load()
      setArmed(true)
    }
    try {
      el.muted = false
      await el.play()
      setPlaying(true)
      onPlay?.()
    } catch {
      /* autoplay policies */
    }
  }

  return (
    <div className={`lazy-video ${playing ? 'is-playing' : ''} ${className}`.trim()}>
      <video
        ref={videoRef}
        poster={poster}
        playsInline
        controls={playing || controls}
        preload="none"
        onPause={() => {
          setPlaying(false)
          onPause?.()
        }}
        onEnded={() => {
          setPlaying(false)
          onEnded?.()
        }}
        onPlay={() => {
          setPlaying(true)
          onPlay?.()
        }}
      />
      {!playing && (
        <button type="button" className="media-video-play" onClick={play} aria-label="播放视频">
          <span className="media-video-play-icon" aria-hidden="true" />
          <span>{playLabel}</span>
        </button>
      )}
    </div>
  )
}
