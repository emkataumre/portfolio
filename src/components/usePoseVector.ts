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

/** Path of the WebP image for a Pose. */
export function poseSrc(pose: Pose) {
  return `/avatar/pose-${pose}.webp`
}

// Unit vectors in screen space. Y points down, so Up is [0, -1].
const DIAGONAL = Math.SQRT1_2
const DIRECTIONS: ReadonlyArray<readonly [Pose, number, number]> = [
  ['up', 0, -1],
  ['down', 0, 1],
  ['left', -1, 0],
  ['right', 1, 0],
  ['up-left', -DIAGONAL, -DIAGONAL],
  ['up-right', DIAGONAL, -DIAGONAL],
  ['down-left', -DIAGONAL, DIAGONAL],
  ['down-right', DIAGONAL, DIAGONAL],
]

const STRENGTH = 1.6
// Guard only. A normalised vector always scores at least cos(22.5 deg) = 0.92 against its nearest direction.
const THRESHOLD = 0.8
const DEAD_ZONE = 0.25
const HYSTERESIS = 0.05
const SPRING = { stiffness: 120, damping: 20 }

function clamp(value: number) {
  return Math.min(1, Math.max(-1, value))
}

/**
 * Picks the Pose for a smoothed vector. The current Pose keeps until a rival
 * beats its score by the hysteresis. The dead zone has a symmetric band:
 * leaving Center needs a magnitude above 0.30, returning needs one below 0.20.
 */
export function nextPose(current: Pose, x: number, y: number): Pose {
  const magnitude = Math.hypot(x, y)
  const exit = current === 'center' ? DEAD_ZONE + HYSTERESIS : DEAD_ZONE - HYSTERESIS
  if (magnitude < exit) return 'center'

  const unitX = x / magnitude
  const unitY = y / magnitude
  let best: Pose = 'center'
  let bestScore = -Infinity
  let currentScore = -Infinity
  for (const [pose, directionX, directionY] of DIRECTIONS) {
    const score = unitX * directionX + unitY * directionY
    if (pose === current) currentScore = score
    if (score > bestScore) {
      best = pose
      bestScore = score
    }
  }

  if (currentScore >= THRESHOLD && bestScore - currentScore < HYSTERESIS) return current
  return bestScore >= THRESHOLD ? best : current
}

/**
 * Tracks the pointer relative to the avatar container. Returns the smoothed
 * vector, the active Pose, and the reduced motion flag. Under reduced motion
 * it attaches no listeners and the vector stays at zero.
 */
export function usePoseVector(container: RefObject<HTMLElement | null>) {
  const reduced = useReducedMotion() === true
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
      const element = container.current
      if (!element) return
      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      rawX.set(clamp(((event.clientX - centerX) / (window.innerWidth / 2)) * STRENGTH))
      rawY.set(clamp(((event.clientY - centerY) / (window.innerHeight / 2)) * STRENGTH))
    }
    const reset = () => {
      rawX.set(0)
      rawY.set(0)
    }

    // Decode all nine Poses before tracking starts, so a swap never shows a blank image.
    Promise.allSettled(
      POSES.map((pose) => {
        const image = new Image()
        image.src = poseSrc(pose)
        return image.decode()
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
  }, [reduced, container, rawX, rawY])

  return { x, y, pose, reduced }
}
