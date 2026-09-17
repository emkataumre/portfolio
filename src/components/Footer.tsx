import { motion, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, type RefObject } from 'react'
import './Footer.css'

const SURFACE =
  'footer-surface flex h-32 items-center justify-center text-stone-50'

const QUOTE = '“The proof is in what ships.”'

function useFooterSignal() {
  const surface = useRef<HTMLElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const element = surface.current
    if (!element) return

    const relocateSignal = () => {
      const x = 18 + Math.random() * 64
      const y = 22 + Math.random() * 56
      const x2 = Math.min(90, Math.max(10, x + (Math.random() - 0.5) * 24))
      const y2 = Math.min(88, Math.max(12, y + (Math.random() - 0.5) * 34))
      const x3 = Math.min(92, Math.max(8, x + (Math.random() - 0.5) * 34))
      const y3 = Math.min(90, Math.max(10, y + (Math.random() - 0.5) * 42))
      element.style.setProperty('--footer-signal-x', `${x}%`)
      element.style.setProperty('--footer-signal-y', `${y}%`)
      element.style.setProperty('--footer-signal-x-secondary', `${x2}%`)
      element.style.setProperty('--footer-signal-y-secondary', `${y2}%`)
      element.style.setProperty('--footer-signal-x-tertiary', `${x3}%`)
      element.style.setProperty('--footer-signal-y-tertiary', `${y3}%`)
    }

    let relocateTimer = 0
    let revealTimer = 0
    const cycle = () => {
      element.classList.add('footer-surface--relocating')
      revealTimer = window.setTimeout(() => {
        relocateSignal()
        element.classList.remove('footer-surface--relocating')
        relocateTimer = window.setTimeout(cycle, 3200 + Math.random() * 3000)
      }, 820)
    }

    relocateTimer = window.setTimeout(cycle, 2800 + Math.random() * 2200)

    return () => {
      window.clearTimeout(relocateTimer)
      window.clearTimeout(revealTimer)
      element.classList.remove('footer-surface--relocating')
    }
  }, [])

  return surface
}

function FooterContent() {
  return (
    <blockquote className="footer-quote text-[clamp(1.5rem,3vw,2rem)] leading-none font-semibold tracking-[-0.035em]">
      <span>{QUOTE}</span>
    </blockquote>
  )
}

function Footer() {
  const surface = useFooterSignal()

  return (
    <footer ref={surface} className={`mt-30 ${SURFACE}`}>
      <span className="footer-signal" aria-hidden="true" />
      <FooterContent />
    </footer>
  )
}

export function FooterReveal({ target }: { target: RefObject<HTMLDivElement | null> }) {
  const surface = useFooterSignal()
  const { scrollYProgress } = useScroll({ target, offset: ['start end', 'end end'] })
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <motion.footer
      ref={surface}
      className={`fixed inset-x-0 bottom-0 ${SURFACE}`}
      style={{ opacity }}
    >
      <span className="footer-signal" aria-hidden="true" />
      <FooterContent />
    </motion.footer>
  )
}

export default Footer
