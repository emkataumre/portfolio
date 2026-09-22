import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useId, useRef, useState } from 'react'
import activity from '../activity/activity.json'
import { EASE } from './ease'
import Reveal from './Reveal'

const GRID_ROWS = 3
const DAY_MS = 86_400_000
const activityDate = new Intl.DateTimeFormat('en-GB', {
  timeZone: activity.timeZone,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})
const metrics = [
  { value: 30_000, suffix: '+', label: 'lines of code' },
  { value: 200, suffix: '+', label: 'issues' },
  { value: 350, suffix: '+', label: 'commits' },
] as const

const mix = (percent: number) =>
  `color-mix(in oklab, var(--color-accent) ${percent}%, var(--color-surface))`

/** A logarithmic scale keeps low counts visible when one day has an unusually high count. */
function cellColor(count: number, maximum: number) {
  if (count === 0) return mix(12)
  const relative = Math.log1p(count) / Math.log1p(maximum)
  return mix(Math.round(38 + relative * 62))
}

function todayKey() {
  const parts = activityDate.formatToParts(new Date())
  const part = (type: string) => parts.find((item) => item.type === type)?.value
  return `${part('year')}-${part('month')}-${part('day')}`
}

function windowDays(today: string) {
  const end = new Date(`${today}T00:00:00Z`)
  const start = new Date(end)
  start.setUTCDate(1)
  start.setUTCMonth(start.getUTCMonth() - 4)
  const lastDayOfMonth = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0)).getUTCDate()
  start.setUTCDate(Math.min(end.getUTCDate(), lastDayOfMonth))
  return Array.from(
    { length: Math.round((end.getTime() - start.getTime()) / DAY_MS) + 1 },
    (_, index) => new Date(start.getTime() + index * DAY_MS).toISOString().slice(0, 10),
  )
}

function labelFor(day: string, count: number | null) {
  const date = new Date(`${day}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
  return count === null
    ? `${date} · Awaiting next refresh`
    : `${date} · ${count} ${count === 1 ? 'commit' : 'commits'}`
}

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const reduceMotion = useReducedMotion() === true
  const ref = useRef<HTMLSpanElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const element = ref.current
    if (!element || reduceMotion) return

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setIsInView(true)
      observer.disconnect()
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [reduceMotion])

  useEffect(() => {
    if (reduceMotion || !isInView) return

    const startedAt = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / 900, 1)
      setCount(Math.round(value * (1 - (1 - progress) ** 3)))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [isInView, reduceMotion, value])

  return (
    <span ref={ref} aria-label={`${value.toLocaleString('en-GB')} plus`}>
      <span aria-hidden="true">
        {(reduceMotion ? value : count).toLocaleString('en-GB').replaceAll(',', ' ')}
        {suffix}
      </span>
    </span>
  )
}

function ActivityGrid() {
  const reduceMotion = useReducedMotion() === true
  const [today, setToday] = useState(todayKey)
  useEffect(() => {
    const updateToday = () => setToday(todayKey())
    const timer = window.setInterval(updateToday, 60_000)
    document.addEventListener('visibilitychange', updateToday)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', updateToday)
    }
  }, [])
  // The tab stop remembers the last cell the keyboard reached, so the grid keeps
  // one tab stop and returns to where it was.
  const [visited, setVisited] = useState<number | null>(null)
  const cellRefs = useRef(new Map<number, HTMLDivElement>())
  const titleId = useId()
  const hintId = useId()

  const days = windowDays(today)
  const dataStart = Date.parse(`${activity.days.from}T00:00:00Z`)
  const counts = days.map((day) => {
    if (day > activity.days.to) return null
    const index = Math.round((Date.parse(`${day}T00:00:00Z`) - dataStart) / DAY_MS)
    return activity.commits[index] ?? null
  })
  const commitTotal = counts.reduce<number>((sum, count) => sum + (count ?? 0), 0)
  const maximum = Math.max(1, ...counts.map((count) => count ?? 0))
  const columns = Math.ceil(days.length / GRID_ROWS)
  const gridWidth = columns * 14 - 3
  const gridHeight = GRID_ROWS * 14 - 3
  const tabStop = visited ?? 0

  const move = (from: number, delta: number) => {
    const next = Math.min(days.length - 1, Math.max(0, from + delta))
    setVisited(next)
    cellRefs.current.get(next)?.focus()
  }

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const step =
      event.key === 'ArrowRight'
        ? GRID_ROWS
        : event.key === 'ArrowLeft'
          ? -GRID_ROWS
          : event.key === 'ArrowDown'
            ? 1
            : event.key === 'ArrowUp'
              ? -1
              : 0
    if (step === 0) return
    event.preventDefault()
    move(index, step)
  }

  return (
    <Reveal className="mx-auto w-full max-w-[720px] px-4">
      <div
        className="grid grid-cols-2 gap-x-8 gap-y-7 text-center min-[520px]:grid-cols-3 min-[520px]:text-left"
        aria-label="At Inact, through senior review"
      >
        {metrics.map((metric, index) => (
          <div key={metric.label} className={index === 0 ? 'col-span-2 min-[520px]:col-span-1' : ''}>
            <strong
              className={`block leading-none tracking-[-0.04em] ${
                index === 0
                  ? 'text-[clamp(3rem,15vw,4rem)] min-[520px]:text-[clamp(1.65rem,4vw,2.5rem)]'
                  : 'text-[clamp(2rem,10vw,2.75rem)] min-[520px]:text-[clamp(1.65rem,4vw,2.5rem)]'
              }`}
            >
              <CountUp value={metric.value} suffix={metric.suffix} />
            </strong>
            <span className="mt-2 block font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-muted">
              {metric.label}
            </span>
          </div>
        ))}
        <p className="col-span-2 text-sm text-muted min-[520px]:col-span-3 min-[520px]:text-left min-[520px]:text-xs">
          At Inact, through senior review.
        </p>
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
        <h2 id={titleId} className="text-lg font-semibold tracking-[-0.02em]">
          {commitTotal} commits across accounts (4 months)
        </h2>
        <p
          className="flex items-center gap-1.5 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-accent"
          aria-label="Live data, refreshed twice daily"
          title="GitHub activity refreshes twice daily"
        >
          <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
          Live
        </p>
      </div>

      <p id={hintId} className="sr-only">
        Rolling 4-month view. Use the arrow keys to move between days.
      </p>

      <div className="mt-4 min-w-0">
        <div
          role="group"
          aria-labelledby={titleId}
          aria-describedby={hintId}
          className="mx-auto grid justify-center gap-[3px] [grid-auto-flow:column]"
          style={{
            width: `min(100%, ${gridWidth}px)`,
            aspectRatio: `${gridWidth} / ${gridHeight}`,
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${GRID_ROWS}, minmax(0, 1fr))`,
          }}
        >
          {days.map((day, index) => (
            <motion.div
              key={day}
              ref={(node) => {
                if (node) cellRefs.current.set(index, node)
                else cellRefs.current.delete(index)
              }}
              tabIndex={index === tabStop ? 0 : -1}
              role="img"
              aria-label={labelFor(day, counts[index])}
              title={labelFor(day, counts[index])}
              className="aspect-square rounded-[3px] outline-offset-2 focus-visible:outline-2 focus-visible:outline-accent"
              style={{ backgroundColor: cellColor(counts[index] ?? 0, maximum) }}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.4 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{
                duration: reduceMotion ? 0 : 0.24,
                ease: EASE,
                delay: reduceMotion ? 0 : Math.floor(index / GRID_ROWS) * 0.045,
              }}
              onFocus={() => setVisited(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
            />
          ))}
        </div>
      </div>
    </Reveal>
  )
}

export default ActivityGrid
