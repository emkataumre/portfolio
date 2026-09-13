import { useMemo, useRef, type CSSProperties, type ReactNode } from 'react'
import { motion, useTransform } from 'motion/react'
import { ASCII_POSES } from './asciiPoses'
import { usePoseVector } from './usePoseVector'

type CursorAvatarProps = {
  expanded: boolean
  controlsId: string
  onToggle: () => void
}

type TideStyle = CSSProperties & { '--tide-delay': string }
const ASCII_GRID_COLUMNS = 68

function renderPose(source: string) {
  const lines = source.split('\n').map((line) => line.padEnd(ASCII_GRID_COLUMNS))
  const nodes: ReactNode[] = []

  lines.forEach((line, row) => {
    Array.from(line).forEach((character, column) => {
      const key = `${row}-${column}`
      if (character === ' ' || (column * 7 + row * 11) % 5 > 2) {
        nodes.push(character)
        return
      }

      const style: TideStyle = {
        '--tide-delay': `${-(column * 0.035 + row * 0.12)}s`,
      }
      nodes.push(
        <span className="ascii-avatar__glyph" style={style} key={key}>
          {character}
        </span>,
      )
    })
    if (row < lines.length - 1) nodes.push('\n')
  })

  return nodes
}

/** The hero Cursor Avatar. It swaps between nine fixed ASCII Poses. */
function CursorAvatar({ expanded, controlsId, onToggle }: CursorAvatarProps) {
  const container = useRef<HTMLButtonElement>(null)
  const effectsEnabled = !expanded
  const { x, y, pose, reduced } = usePoseVector(container, effectsEnabled)
  const activePose = effectsEnabled ? pose : 'center'
  const glyphs = useMemo(() => renderPose(ASCII_POSES[activePose]), [activePose])

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
        style={reduced || !effectsEnabled ? undefined : { x: translateX, y: translateY, rotate: x, scale }}
      >
        <pre
          aria-hidden="true"
          data-pose={activePose}
          className={`ascii-avatar${effectsEnabled ? ' ascii-avatar--active' : ''}`}
        >
          {glyphs}
        </pre>
      </motion.div>
    </button>
  )
}

export default CursorAvatar
