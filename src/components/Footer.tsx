import { motion, useScroll, useTransform } from 'motion/react'
import type { RefObject } from 'react'

const SURFACE =
  'flex h-32 items-center justify-center bg-[#1d1f20] bg-[radial-gradient(circle,rgba(255,255,255,0.16)_1px,transparent_1px)] bg-[length:11px_11px] text-stone-50'

function FooterContent() {
  return (
    <blockquote className="text-[clamp(1.5rem,3vw,2rem)] leading-none font-semibold tracking-[-0.035em]">
      “The work is the argument.”
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

  return (
    <motion.footer className={`fixed inset-x-0 bottom-0 ${SURFACE}`} style={{ opacity }}>
      <FooterContent />
    </motion.footer>
  )
}

export default Footer
