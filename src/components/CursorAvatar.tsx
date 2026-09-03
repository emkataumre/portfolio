import { useEffect, useRef, useState } from 'react'
import { motion, useTransform } from 'motion/react'
import { POSES, poseSrc, usePoseVector, type Pose } from './usePoseVector'
import { FLICKER_MS, drawPixelFilter, drawPixelOverlay } from './pixelOverlay'

const FADE = 'opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1)'

// Decoded Pose images for the overlay, loaded once per Pose on demand.
const poseImages = new Map<Pose, Promise<HTMLImageElement>>()
function loadPose(pose: Pose) {
  let loading = poseImages.get(pose)
  if (!loading) {
    const image = new Image()
    image.src = poseSrc(pose)
    loading = image.decode().then(() => image)
    poseImages.set(pose, loading)
  }
  return loading
}

/** The hero Cursor Avatar. Nine stacked Pose images, the active one visible. */
function CursorAvatar() {
  const container = useRef<HTMLDivElement>(null)
  const filter = useRef<HTMLCanvasElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const { x, y, pose, reduced } = usePoseVector(container)
  const [hovered, setHovered] = useState(false)
  // The canvas turns opaque only after its first draw, so a blank or stale frame never fades in.
  const [drawn, setDrawn] = useState(false)

  // Wobble: translate up to 2 px, rotate up to 1 deg, scale 1 to 1.01 by magnitude.
  const translateX = useTransform(x, (value) => value * 2)
  const translateY = useTransform(y, (value) => value * 2)
  const scale = useTransform(
    [x, y],
    ([valueX, valueY]: number[]) => 1 + Math.min(1, Math.hypot(valueX, valueY)) * 0.01,
  )

  // Pixel filter: always on, redraw on Pose change and on resize.
  useEffect(() => {
    let cancelled = false
    let cleanup = () => {}

    loadPose(pose)
      .then((image) => {
        if (cancelled) return
        const draw = () => {
          const frame = container.current
          const target = filter.current
          if (!frame || !target) return
          drawPixelFilter(target, image, frame.clientWidth)
        }
        draw()
        window.addEventListener('resize', draw)
        cleanup = () => window.removeEventListener('resize', draw)
      })
      .catch(() => {})

    return () => {
      cancelled = true
      cleanup()
    }
  }, [pose])

  // Hover overlay: draw the active Pose on enter, on Pose change, on resize, and on an
  // interval with a random source offset. Reduced motion draws once and skips the flicker.
  useEffect(() => {
    if (!hovered) return

    let cancelled = false
    let timer: number | undefined

    loadPose(pose)
      .then((image) => {
        if (cancelled) return
        const draw = () => {
          const frame = container.current
          const target = canvas.current
          if (!frame || !target) return
          drawPixelOverlay(target, image, frame.clientWidth, !reduced)
        }
        draw()
        setDrawn(true)
        window.addEventListener('resize', draw)
        if (!reduced) timer = window.setInterval(draw, FLICKER_MS)
        cleanup = () => {
          window.clearInterval(timer)
          window.removeEventListener('resize', draw)
        }
      })
      .catch(() => {})

    let cleanup = () => {}
    return () => {
      cancelled = true
      cleanup()
    }
  }, [hovered, pose, reduced])

  return (
    <div
      ref={container}
      role="img"
      aria-label="Emil Vladinov"
      className="size-55 overflow-hidden rounded-[28px] bg-[#e9e9e6] min-[760px]:size-70"
      onPointerEnter={() => {
        if (!window.matchMedia('(pointer: coarse)').matches) setHovered(true)
      }}
      onPointerLeave={() => {
        setHovered(false)
        setDrawn(false)
      }}
    >
      <motion.div
        className="relative size-full"
        style={reduced ? undefined : { x: translateX, y: translateY, rotate: x, scale }}
      >
        {POSES.map((name) => (
          <img
            key={name}
            src={poseSrc(name)}
            alt={name === 'center' ? 'Pixelated portrait of Emil Vladinov' : ''}
            width={370}
            height={370}
            fetchPriority={name === 'center' ? 'high' : undefined}
            className="absolute inset-0 size-full object-cover"
            style={{ visibility: name === pose ? 'visible' : 'hidden' }}
          />
        ))}
        <canvas
          ref={filter}
          aria-hidden
          className="pointer-events-none absolute inset-0 size-full"
          style={{ imageRendering: 'pixelated' }}
        />
        <canvas
          ref={canvas}
          aria-hidden
          className="pointer-events-none absolute inset-0 size-full"
          style={{
            imageRendering: 'pixelated',
            opacity: hovered && drawn ? 1 : 0,
            transition: reduced ? 'none' : FADE,
          }}
        />
      </motion.div>
    </div>
  )
}

export default CursorAvatar
