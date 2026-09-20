import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { EASE } from './ease'
import { HookSidebar } from './ui/hook-sidebar'

const items = [
  { label: 'Overview', href: '#overview' },
  { label: 'Activity', href: '#activity' },
  { label: 'Method', href: '#method' },
  { label: 'Work', href: '#work' },
  { label: 'Contact', href: '#contact' },
]

function Nav() {
  const [active, setActive] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const manualActive = useRef(false)

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      if (manualActive.current) return

      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
      const endZone = Math.min(window.innerHeight * 0.5, maxScroll)
      const endProgress =
        endZone === 0
          ? 1
          : Math.max(0, Math.min(1, (window.scrollY - (maxScroll - endZone)) / endZone))
      const marker = window.innerHeight * (0.35 + 0.65 * endProgress)
      let current = 0

      items.forEach((item, index) => {
        const section = document.getElementById(item.href.slice(1))
        if (section && section.getBoundingClientRect().top <= marker) current = index
      })

      setActive(current)
    }

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    const resumeTracking = () => {
      manualActive.current = false
      scheduleUpdate()
    }

    const selectHash = () => {
      const hashIndex = items.findIndex((item) => item.href === location.hash)
      if (hashIndex < 0) return
      manualActive.current = true
      setActive(hashIndex)
    }

    const resumeFromKey = (event: KeyboardEvent) => {
      if (
        ['ArrowDown', 'ArrowUp', 'End', 'Home', 'PageDown', 'PageUp', ' '].includes(event.key)
      ) {
        resumeTracking()
      }
    }

    if (location.hash) selectHash()
    else update()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    window.addEventListener('wheel', resumeTracking, { passive: true })
    window.addEventListener('touchmove', resumeTracking, { passive: true })
    window.addEventListener('keydown', resumeFromKey)
    window.addEventListener('hashchange', selectHash)
    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      window.removeEventListener('wheel', resumeTracking)
      window.removeEventListener('touchmove', resumeTracking)
      window.removeEventListener('keydown', resumeFromKey)
      window.removeEventListener('hashchange', selectHash)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <div className="hidden min-[900px]:block">
        <HookSidebar
          label="Emil Vladinov"
          items={items}
          value={active}
          onChange={(index) => {
            manualActive.current = true
            setActive(index)
          }}
        />
      </div>

      <nav className="relative min-[900px]:hidden" aria-label="Main navigation">
        <div className="flex h-14 items-center justify-between border-b border-line">
          <a
            href="#overview"
            className="font-semibold tracking-[-0.02em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            onClick={() => setMobileOpen(false)}
          >
            Emil Vladinov
          </a>
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation-links"
            className="min-h-11 min-w-14 rounded-xl border border-line bg-surface px-3 text-sm font-semibold transition-colors active:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? 'Close' : 'Menu'}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {mobileOpen && (
            <motion.div
              id="mobile-navigation-links"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="absolute inset-x-0 top-14 border-b border-line bg-bg py-2 shadow-[0_12px_24px_rgba(24,24,27,0.08)]"
            >
              {items.map((item, index) => (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={index === active ? 'location' : undefined}
                  className="flex min-h-11 items-center justify-between rounded-xl px-3 text-base font-medium transition-colors hover:bg-surface active:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
                  onClick={() => {
                    manualActive.current = true
                    setActive(index)
                    setMobileOpen(false)
                  }}
                >
                  {item.label}
                  {index === active && (
                    <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
                  )}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.div>
  )
}

export default Nav
