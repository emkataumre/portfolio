import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState, type RefObject } from 'react'
import './Footer.css'

const SURFACE =
  'flex h-32 items-center justify-center bg-[#1d1f20] bg-[radial-gradient(circle,rgba(255,255,255,0.16)_1px,transparent_1px)] bg-[length:11px_11px] text-stone-50'

function FooterContent({ active = true }: { active?: boolean }) {
  const reflection = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!active || reduced || !reflection.current) return
    const animation = reflection.current.animate(
      [
        { backgroundPosition: '100% 50%', offset: 0 },
        { backgroundPosition: '0% 50%', offset: 4.7 / 6.9 },
        { backgroundPosition: '0% 50%', offset: 1 },
      ],
      { duration: 6900, iterations: Infinity, easing: 'linear' },
    )
    const visibility = () => document.hidden ? animation.pause() : animation.play()
    visibility()
    document.addEventListener('visibilitychange', visibility)
    return () => {
      animation.cancel()
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [active, reduced])

  return (
    <blockquote className="footer-quote text-[clamp(1.5rem,3vw,2rem)] leading-none font-semibold tracking-[-0.035em]">
      <span>“The work is in the argument.”</span>
      <span ref={reflection} className="footer-quote__reflection" aria-hidden="true">
        “The work is in the argument.”
      </span>
    </blockquote>
  )
}

function Footer({ id }: { id?: string }) {
  return (
    <footer id={id} className={`mt-30 ${SURFACE}`}>
      <FooterContent />
    </footer>
  )
}

export function FooterReveal({ target }: { target: RefObject<HTMLDivElement | null> }) {
  const { scrollYProgress } = useScroll({ target, offset: ['start end', 'end end'] })
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1])
  const [active, setActive] = useState(false)
  useMotionValueEvent(scrollYProgress, 'change', (progress) => setActive(progress > 0))

  return (
    <motion.footer className={`fixed inset-x-0 bottom-0 ${SURFACE}`} style={{ opacity }}>
      <FooterContent active={active} />
    </motion.footer>
  )
}

export default Footer
