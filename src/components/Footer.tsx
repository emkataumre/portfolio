import { motion, useScroll, useTransform } from 'motion/react'
import type { RefObject } from 'react'
import { site } from '../site'

const LAYOUT = 'flex flex-wrap items-center justify-between gap-x-7 gap-y-2 text-sm text-muted'

function FooterContent() {
  return (
    <>
      <span>Emil Vladinov · Copenhagen</span>
      <div className="flex flex-wrap gap-x-7 gap-y-2">
        <a href={`mailto:${site.email}`}>{site.email}</a>
        <a href={site.github} rel="me">
          GitHub
        </a>
        <a href={site.linkedin} rel="me">
          LinkedIn
        </a>
      </div>
    </>
  )
}

function Footer({ id }: { id?: string }) {
  return (
    <footer id={id} className={`mt-30 ${LAYOUT}`}>
      <FooterContent />
    </footer>
  )
}

export function FooterReveal({ target }: { target: RefObject<HTMLDivElement | null> }) {
  const { scrollYProgress } = useScroll({ target, offset: ['start end', 'end end'] })
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <motion.footer
      className={`fixed inset-x-0 bottom-0 h-32 ${LAYOUT} mx-auto max-w-[1040px] px-8`}
      style={{ opacity }}
    >
      <FooterContent />
    </motion.footer>
  )
}

export default Footer
