import { useRef } from 'react'
import { motion, useTransform } from 'motion/react'
import { POSES, poseSrc, usePoseVector } from './usePoseVector'

/** The hero Cursor Avatar. Nine stacked Pose images, the active one visible. */
function CursorAvatar() {
  const container = useRef<HTMLDivElement>(null)
  const { x, y, pose, reduced } = usePoseVector(container)

  // Wobble: translate up to 2 px, rotate up to 1 deg, scale 1 to 1.01 by magnitude.
  const translateX = useTransform(x, (value) => value * 2)
  const translateY = useTransform(y, (value) => value * 2)
  const scale = useTransform(
    [x, y],
    ([valueX, valueY]: number[]) => 1 + Math.min(1, Math.hypot(valueX, valueY)) * 0.01,
  )

  return (
    <div
      ref={container}
      role="img"
      aria-label="Emil Vladinov"
      className="order-first size-55 justify-self-start overflow-hidden rounded-[28px] bg-[#e9e9e6] min-[760px]:order-none min-[760px]:size-70 min-[760px]:justify-self-end"
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
      </motion.div>
    </div>
  )
}

export default CursorAvatar
