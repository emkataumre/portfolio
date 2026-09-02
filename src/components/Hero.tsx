import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { site } from '../site'

// PROTOTYPE: two variants of the avatar unfold, switchable via ?variant=1|3 on /.
// 1: the card slides left when it opens. 3: the avatar sits pulled in so the card opens into fixed space.
export const variants = { '1': 'Card slides left', '3': 'Avatar pulled in' } as const
export type Variant = keyof typeof variants

function Hero({ variant }: { variant: Variant }) {
  const [open, setOpen] = useState(false)
  const PANEL = window.matchMedia('(min-width: 760px)').matches ? 240 : 0
  return (
    <section className="mt-22 grid grid-cols-1 items-center gap-14 min-[760px]:grid-cols-[1.3fr_1fr]">
      <div>
        <h1 className="text-[clamp(2.4rem,5vw,3.6rem)] leading-[1.02] font-bold tracking-[-0.035em]">
          Real software, built with AI agents.
        </h1>
        <p className="mt-5.5 max-w-130 text-xl leading-[1.45] text-muted">
          The agents write the code. The engineering does not change: small steps, tests,
          review, and runtime verification. I own the result. Software engineer in Copenhagen.
        </p>
      </div>
      <motion.div
        animate={{ x: variant === '3' || open ? -PANEL : 0 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className={`relative order-first w-55 justify-self-start rounded-[28px] border border-line bg-surface p-2 transition-[border-radius] duration-200 min-[760px]:order-none min-[760px]:w-70 min-[760px]:justify-self-end ${
          open ? 'min-[760px]:rounded-r-none min-[760px]:border-r-transparent' : ''
        }`}
      >
        <button
          type="button"
          aria-expanded={open}
          aria-controls="avatar-card"
          aria-label={open ? 'Fold the profile card' : 'Unfold the profile card'}
          onClick={() => setOpen((v) => !v)}
          className="block aspect-square w-full cursor-pointer overflow-hidden rounded-[22px] bg-[#e9e9e6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <img
            src="/avatar/pose-center.webp"
            alt="Pixelated portrait of Emil Vladinov"
            width={370}
            height={370}
            fetchPriority="high"
            className="size-full object-cover"
          />
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id="avatar-card"
              key="card"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-full left-0 z-20 mt-3 overflow-hidden rounded-[28px] border border-line bg-surface min-[760px]:-top-px min-[760px]:left-full min-[760px]:mt-0 min-[760px]:h-[calc(100%+2px)] min-[760px]:rounded-l-none min-[760px]:border-l-0"
            >
              <div className="flex h-full w-60 flex-col justify-between py-4 pr-5 pl-3 min-[760px]:py-4.5">
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
                    className="mt-3.5 inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-[0.9rem] font-medium hover:border-accent hover:text-accent"
                  >
                    GitHub
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}

export default Hero
