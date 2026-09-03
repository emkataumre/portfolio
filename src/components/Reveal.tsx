import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { EASE } from './ease'

const VIEWPORT = { once: true, amount: 0.15, margin: '0px 0px -40px 0px' } as const

type RevealProps = {
  /** The rendered tag. Keep the DOM semantics of the element the reveal replaces. */
  as?: 'div' | 'p' | 'h1' | 'dl'
  /** Mount mode: run once at mount after this delay, 0.6 s. Absent: in-view mode, 0.5 s. */
  delay?: number
  className?: string
  children: ReactNode
}

/** One reveal: opacity 0 to 1, y 12 px to 0. Runs once. */
function Reveal({ as = 'div', delay, className, children }: RevealProps) {
  const Tag = motion[as] as typeof motion.div
  const hidden = { opacity: 0, y: 12 }
  const shown = { opacity: 1, y: 0 }

  if (delay !== undefined) {
    return (
      <Tag
        className={className}
        initial={hidden}
        animate={shown}
        transition={{ duration: 0.6, delay, ease: EASE }}
      >
        {children}
      </Tag>
    )
  }

  return (
    <Tag
      className={className}
      initial={hidden}
      whileInView={shown}
      viewport={VIEWPORT}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {children}
    </Tag>
  )
}

export default Reveal
