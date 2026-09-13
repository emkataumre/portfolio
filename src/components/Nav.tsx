import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { EASE } from './ease'
import { HookSidebar } from './ui/hook-sidebar'

const items = [
  { label: 'Overview', href: '#overview' },
  { label: 'Method', href: '#method' },
  { label: 'Work', href: '#work' },
  { label: 'Activity', href: '#activity' },
  { label: 'Contact', href: '#contact' },
]

function Nav() {
  const [active, setActive] = useState(0)
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
      <HookSidebar
        label="Emil Vladinov"
        items={items}
        value={active}
        onChange={(index) => {
          manualActive.current = true
          setActive(index)
        }}
      />
    </motion.div>
  )
}

export default Nav
