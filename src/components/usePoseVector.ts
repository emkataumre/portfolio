import { useEffect, useState, type RefObject } from 'react'
import { useMotionValue, useMotionValueEvent, useReducedMotion, useSpring } from 'motion/react'

export const POSES = [
  'center',
  'up',
  'down',
  'left',
  'right',
  'up-left',
  'up-right',
  'down-left',
  'down-right',
] as const

export type Pose = (typeof POSES)[number]

export function poseSrc(pose: Pose) {
  return `/avatar/pose-${pose}.webp`
}

// Unit vectors in screen space. Y points down, so Up is [0, -1].
const D = Math.SQRT1_2
const DIRECTIONS: ReadonlyArray<readonly [Pose, number, number]> = [
  ['up', 0, -1],
  ['down', 0, 1],
  ['left', -1, 0],
  ['right', 1, 0],
  ['up-left', -D, -D],
  ['up-right', D, -D],
  ['down-left', -D, D],
  ['down-right', D, D],
]

const STRENGTH = 1.6
const THRESHOLD = 0.8
const DEAD_ZONE = 0.25
const HYSTERESIS = 0.05
const SPRING = { stiffness: 120, damping: 20 }

function clamp(value: number) {
  return Math.min(1, Math.max(-1, value))
}

// Picks the Pose for a smoothed vector. The current Pose keeps until a rival
// beats its score by the hysteresis. Leaving Center needs a magnitude above the
// dead zone. Returning to Center needs a magnitude below the dead zone minus
// the hysteresis.
export function nextPose(current: Pose, x: number, y: number): Pose {
  const magnitude = Math.hypot(x, y)
  const exit = current === 'center' ? DEAD_ZONE : DEAD_ZONE - HYSTERESIS
  if (magnitude < exit) return 'center'

  const nx = x / magnitude
  const ny = y / magnitude
  let best: Pose = 'center'
  let bestScore = -Infinity
  let currentScore = -Infinity
  for (const [pose, dx, dy] of DIRECTIONS) {
    const score = nx * dx + ny * dy
    if (pose === current) currentScore = score
    if (score > bestScore) {
      best = pose
      bestScore = score
    }
  }

  if (currentScore >= THRESHOLD && bestScore - currentScore < HYSTERESIS) return current
  return bestScore >= THRESHOLD ? best : current
}

// Tracks the pointer relative to the frame. Returns the smoothed vector and
// the active Pose. Under reduced motion it attaches no listeners and the
// vector stays at zero.
export function usePoseVector(frame: RefObject<HTMLElement | null>) {
  const reduced = useReducedMotion()
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, SPRING)
  const y = useSpring(rawY, SPRING)
  const [pose, setPose] = useState<Pose>('center')

  const update = () => {
    setPose((current) => nextPose(current, x.get(), y.get()))
  }
  useMotionValueEvent(x, 'change', update)
  useMotionValueEvent(y, 'change', update)

  useEffect(() => {
    if (reduced) return

    let cancelled = false

    const onMove = (event: PointerEvent) => {
      const el = frame.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      rawX.set(clamp(((event.clientX - cx) / (window.innerWidth / 2)) * STRENGTH))
      rawY.set(clamp(((event.clientY - cy) / (window.innerHeight / 2)) * STRENGTH))
    }
    const reset = () => {
      rawX.set(0)
      rawY.set(0)
    }

    // Decode all nine Poses before tracking starts, so a swap never shows a blank frame.
    Promise.allSettled(
      POSES.map((p) => {
        const img = new Image()
        img.src = poseSrc(p)
        return img.decode()
      }),
    ).then(() => {
      if (cancelled) return
      window.addEventListener('pointermove', onMove, { passive: true })
      document.documentElement.addEventListener('pointerleave', reset)
      window.addEventListener('blur', reset)
    })

    return () => {
      cancelled = true
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', reset)
      window.removeEventListener('blur', reset)
    }
  }, [reduced, frame, rawX, rawY])

  return { x, y, pose }
}
