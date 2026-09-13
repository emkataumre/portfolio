import { useRef } from 'react'
import { motion, useTransform } from 'motion/react'
import { ASCII_POSES } from './asciiPoses'
import { usePoseVector } from './usePoseVector'

type CursorAvatarProps = {
  expanded: boolean
  controlsId: string
  onToggle: () => void
}

/** The hero Cursor Avatar. It swaps between nine fixed ASCII Poses. */
function CursorAvatar({ expanded, controlsId, onToggle }: CursorAvatarProps) {
  const container = useRef<HTMLButtonElement>(null)
  const { x, y, pose, reduced } = usePoseVector(container)
  const activePose = ASCII_POSES[pose]

  const translateX = useTransform(x, (value) => value * 2)
  const translateY = useTransform(y, (value) => value * 2)
  const scale = useTransform(
    [x, y],
    ([valueX, valueY]: number[]) => 1 + Math.min(1, Math.hypot(valueX, valueY)) * 0.01,
  )

  return (
    <button
      ref={container}
      type="button"
      aria-expanded={expanded}
      aria-controls={controlsId}
      aria-label={expanded ? 'Fold the profile card' : 'Unfold the profile card'}
      onClick={onToggle}
      className="ascii-avatar-button block aspect-square w-full cursor-pointer overflow-hidden rounded-[22px] bg-[#e9e9e6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <motion.div
        className="relative size-full"
        style={reduced ? undefined : { x: translateX, y: translateY, rotate: x, scale }}
      >
        <pre
          aria-hidden="true"
          data-pose={pose}
          className={`ascii-avatar ascii-avatar--active${expanded ? ' ascii-avatar--expanded' : ''}`}
        >
          <span className="ascii-avatar__base">{activePose}</span>
          <span aria-hidden="true" className="ascii-avatar__wave">
            {activePose}
          </span>
        </pre>
      </motion.div>
    </button>
  )
}

export default CursorAvatar
