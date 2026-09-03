import { motion } from 'motion/react'
import { EASE } from './ease'

function Nav() {
  return (
    <motion.nav
      aria-label="Main"
      className="flex flex-wrap items-center justify-between gap-x-7 gap-y-2 text-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <span>Emil Vladinov</span>
      <div className="flex flex-wrap gap-x-7 gap-y-2">
        <a href="/#work">Work</a>
        <a href="/#method">Method</a>
        <a href="/build-log/">Build Log</a>
        <a href="#contact" className="text-accent">
          Contact
        </a>
      </div>
    </motion.nav>
  )
}

export default Nav
