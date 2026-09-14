import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef, useState, useSyncExternalStore } from 'react'
import { site } from '../site'
import CursorAvatar from './CursorAvatar'
import Reveal from './Reveal'

const PROFILE_CARD_ID = 'profile-card-details'
const CARD_TRANSITION = { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const }
const WIDE_CARD_QUERY = '(min-width: 1060px)'

function subscribeToWideCard(change: () => void) {
  const query = window.matchMedia(WIDE_CARD_QUERY)
  query.addEventListener('change', change)
  return () => query.removeEventListener('change', change)
}

function getWideCardSnapshot() {
  return window.matchMedia(WIDE_CARD_QUERY).matches
}

function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const reduced = useReducedMotion()
  const wideCard = useSyncExternalStore(subscribeToWideCard, getWideCardSnapshot, () => false)
  /** Progress 0 to 1 from hero bottom at viewport bottom to hero bottom at viewport top. */
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['end end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 40])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.5])

  return (
    <section
      ref={heroRef}
      id="overview"
      className="mt-8 grid scroll-mt-8 grid-cols-1 items-center gap-14 min-[760px]:mt-12 min-[760px]:grid-cols-[1.3fr_1fr]"
    >
      <div>
        <Reveal
          as="h1"
          delay={0.1}
          className="text-[clamp(2.4rem,5vw,3.6rem)] leading-[1.02] font-bold tracking-[-0.035em]"
        >
          Agentic development. From idea to production.
        </Reveal>
        <Reveal as="p" delay={0.18} className="mt-5.5 max-w-[470px] text-xl leading-[1.45] text-muted">
          I turn ideas into reliable software by combining AI coding agents with software
          engineering discipline.
        </Reveal>
      </div>
      <Reveal
        delay={0.26}
        className="order-first justify-self-start min-[760px]:order-none min-[760px]:justify-self-end"
      >
        <motion.div style={reduced ? undefined : { y, scale, opacity }}>
          <motion.div
            animate={{ x: profileOpen ? 'var(--profile-card-shift)' : '0px' }}
            transition={reduced ? { duration: 0 } : CARD_TRANSITION}
            className="relative w-55 [--profile-card-shift:0px] min-[760px]:w-70 min-[1060px]:[--profile-card-shift:-200px]"
          >
            <div
              className={`relative rounded-[28px] border border-line bg-surface p-2 transition-[border-radius] duration-200 ${
                profileOpen ? 'min-[1060px]:rounded-r-none min-[1060px]:border-r-transparent' : ''
              }`}
            >
              <CursorAvatar
                expanded={profileOpen}
                controlsId={PROFILE_CARD_ID}
                onToggle={() => setProfileOpen((open) => !open)}
              />
            </div>
            <AnimatePresence initial={false}>
              {profileOpen && (
                <motion.div
                  id={PROFILE_CARD_ID}
                  key="profile-card"
                  initial={
                    reduced ? false : wideCard ? { width: 0, opacity: 0 } : { height: 0, opacity: 0 }
                  }
                  animate={
                    wideCard
                      ? { width: 200, height: 'calc(100% + 2px)', opacity: 1 }
                      : { width: 200, height: 'auto', opacity: 1 }
                  }
                  exit={wideCard ? { width: 0, opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={reduced ? { duration: 0 } : CARD_TRANSITION}
                  className="relative z-20 mt-3 overflow-hidden rounded-[28px] border border-line bg-surface min-[1060px]:absolute min-[1060px]:-top-px min-[1060px]:left-full min-[1060px]:mt-0 min-[1060px]:h-[calc(100%+2px)] min-[1060px]:rounded-l-none min-[1060px]:border-l-0"
                >
                  <div className="flex min-h-50 w-50 flex-col justify-between py-4 pr-5 pl-3 min-[1060px]:h-full min-[1060px]:py-4.5">
                    <div>
                      <p className="text-[1.05rem] font-semibold tracking-[-0.01em]">Emil Vladinov</p>
                      <p className="mt-1 text-[0.95rem] leading-[1.45] text-muted">
                        Creator and enjoyer of things.
                      </p>
                    </div>
                    <div>
                      <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.8125rem]">
                        <li className="flex items-center gap-1.5">
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 16 16"
                            className="size-3.5 text-muted"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M2.5 14V8.5h11V14M2.5 14h11M2 11c1 .8 2 .8 3 0s2-.8 3 0 2 .8 3 0 2-.8 3 0M4.5 8.5V6.5M8 8.5V6.5M11.5 8.5V6.5M8 2v2" />
                          </svg>
                          <span>
                            <span className="sr-only">Age </span>23
                          </span>
                        </li>
                        <li>Copenhagen, Denmark</li>
                      </ul>
                      <a
                        href={site.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3.5 inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-[0.9rem] font-medium transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      >
                        GitHub
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 12 12"
                          className="size-3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 9 9 3M4 3h5v5" />
                        </svg>
                      </a>
                      <a
                        href={site.linkedin}
                        target="_blank"
                        rel="me noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-[0.9rem] font-medium transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      >
                        LinkedIn
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 12 12"
                          className="size-3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 9 9 3M4 3h5v5" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </Reveal>
    </section>
  )
}

export default Hero
