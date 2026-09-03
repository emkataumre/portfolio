import { useRef } from 'react'
import { motion, useReducedMotion, useTransform } from 'motion/react'
import { POSES, poseSrc, usePoseVector } from './usePoseVector'

function CursorAvatar() {
  const frame = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { x, y, pose } = usePoseVector(frame)

  // Wobble: translate up to 2 px, rotate up to 1 deg, scale 1 to 1.01 by magnitude.
  const translateX = useTransform(x, (v) => v * 2)
  const translateY = useTransform(y, (v) => v * 2)
  const rotate = useTransform(x, (v) => v * 1)
  const scale = useTransform([x, y], ([a, b]: number[]) => 1 + Math.min(1, Math.hypot(a, b)) * 0.01)

  return (
    <div
      ref={frame}
      role="img"
      aria-label="Emil Vladinov"
      className="order-first size-55 justify-self-start overflow-hidden rounded-[28px] bg-[#e9e9e6] min-[760px]:order-none min-[760px]:size-70 min-[760px]:justify-self-end"
    >
      <motion.div
        className="relative size-full"
        style={reduced ? undefined : { x: translateX, y: translateY, rotate, scale }}
      >
        {POSES.map((p) => (
          <img
            key={p}
            src={poseSrc(p)}
            alt={p === 'center' ? 'Pixelated portrait of Emil Vladinov' : ''}
            width={370}
            height={370}
            fetchPriority={p === 'center' ? 'high' : undefined}
            className="absolute inset-0 size-full object-cover"
            style={{ visibility: p === pose ? 'visible' : 'hidden' }}
          />
        ))}
      </motion.div>
    </div>
  )
}

export default CursorAvatar
