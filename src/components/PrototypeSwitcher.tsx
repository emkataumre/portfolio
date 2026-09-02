import { useEffect } from 'react'

// PROTOTYPE: floating variant switcher. Dev only.
type Props = { variants: Record<string, string>; current: string }

function PrototypeSwitcher({ variants, current }: Props) {
  const keys = Object.keys(variants)
  const go = (dir: 1 | -1) => {
    const i = keys.indexOf(current)
    const next = keys[(i + dir + keys.length) % keys.length]
    const url = new URL(window.location.href)
    url.searchParams.set('variant', next)
    window.location.replace(url.toString())
  }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })
  if (!import.meta.env.DEV) return null
  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full bg-text px-3 py-1.5 font-mono text-[0.8125rem] text-bg shadow-lg">
      <button type="button" onClick={() => go(-1)} className="px-1">
        &larr;
      </button>
      <span>
        {current} ({variants[current]})
      </span>
      <button type="button" onClick={() => go(1)} className="px-1">
        &rarr;
      </button>
    </div>
  )
}

export default PrototypeSwitcher
