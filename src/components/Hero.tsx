import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import CursorAvatar from './CursorAvatar'
import Reveal from './Reveal'

function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  /** Progress 0 to 1 from hero bottom at viewport bottom to hero bottom at viewport top. */
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['end end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 40])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.5])

  return (
    <section ref={heroRef} className="mt-22 grid grid-cols-1 items-center gap-14 min-[760px]:grid-cols-[1.3fr_1fr]">
      <div>
        <Reveal
          as="h1"
          delay={0.1}
          className="text-[clamp(2.4rem,5vw,3.6rem)] leading-[1.02] font-bold tracking-[-0.035em]"
        >
          Real software, built with AI agents.
        </Reveal>
        <Reveal as="p" delay={0.18} className="mt-5.5 max-w-130 text-xl leading-[1.45] text-muted">
          The agents write the code. The engineering does not change: small steps, tests,
          review, and runtime verification. I own the result. Software engineer in Copenhagen.
        </Reveal>
      </div>
      <Reveal
        delay={0.26}
        className="order-first justify-self-start min-[760px]:order-none min-[760px]:justify-self-end"
      >
        <motion.div style={reduced ? undefined : { y, scale, opacity }}>
          <CursorAvatar />
        </motion.div>
      </Reveal>
    </section>
  )
}

export default Hero
