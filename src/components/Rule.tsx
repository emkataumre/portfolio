import { motion, useReducedMotion } from 'motion/react'
import { EASE } from './ease'

type RuleProps = {
  /** Draw the rule from the left when it comes into view, 80 ms later per index. Absent: static. */
  drawIndex?: number
}

/** A separate element, not a border, so the motion ticket can animate scaleX on it. */
function Rule({ drawIndex }: RuleProps) {
  const reduced = useReducedMotion()
  if (drawIndex === undefined || reduced) {
    return <div aria-hidden="true" className="h-px origin-left bg-line" />
  }
  return (
    <motion.div
      aria-hidden="true"
      className="h-px origin-left bg-line"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.08 * drawIndex }}
    />
  )
}

export default Rule
