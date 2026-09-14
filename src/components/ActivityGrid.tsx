import { motion, useReducedMotion } from 'motion/react'
import { useId, useRef, useState } from 'react'
import activity from '../activity/activity.json'
import { EASE } from './ease'
import Reveal from './Reveal'

const WINDOW_DAYS = 120
const GRID_ROWS = 3

const mix = (percent: number) =>
  `color-mix(in oklab, var(--color-accent) ${percent}%, var(--color-surface))`

/** A logarithmic scale keeps low counts visible when one day has an unusually high count. */
function cellColor(count: number, maximum: number) {
  if (count === 0) return mix(12)
  const relative = Math.log1p(count) / Math.log1p(maximum)
  return mix(Math.round(38 + relative * 62))
}

/**
 * The day of one cell. The first count in the file is `days.from`, so the day of
 * a cell is `days.from` plus its index. The last cell is not always today: the
 * collector rewrites the file only when a measurement moves.
 */
function dayAt(index: number) {
  const day = new Date(`${activity.days.from}T00:00:00Z`)
  day.setUTCDate(day.getUTCDate() + index)
  return day
}

function labelFor(index: number) {
  const count = activity.commits[index]
  const date = dayAt(index).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
  return `${date} · ${count} ${count === 1 ? 'commit' : 'commits'}`
}

function ActivityGrid() {
  const reduceMotion = useReducedMotion() === true
  // The tab stop remembers the last cell the keyboard reached, so the grid keeps
  // one tab stop and returns to where it was.
  const [visited, setVisited] = useState<number | null>(null)
  const cellRefs = useRef(new Map<number, HTMLDivElement>())
  const titleId = useId()
  const hintId = useId()

  const total = activity.commits.length
  const start = Math.max(0, total - WINDOW_DAYS)
  const indexes = Array.from({ length: total - start }, (_, offset) => start + offset)
  const counts = indexes.map((index) => activity.commits[index])
  const commitTotal = counts.reduce((sum, count) => sum + count, 0)
  const maximum = Math.max(1, ...counts)
  const columns = Math.ceil(indexes.length / GRID_ROWS)
  const gridWidth = columns * 14 - 3
  const gridHeight = GRID_ROWS * 14 - 3
  const tabStop = visited ?? start

  const move = (from: number, delta: number) => {
    const next = Math.min(total - 1, Math.max(start, from + delta))
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
    <Reveal className="mx-auto w-full max-w-[720px] border-y border-line px-4 py-6">
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
        <h2 id={titleId} className="text-lg font-semibold tracking-[-0.02em]">
          {commitTotal} commits in 4 months
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
          {indexes.map((index, offset) => (
            <motion.div
              key={index}
              ref={(node) => {
                if (node) cellRefs.current.set(index, node)
                else cellRefs.current.delete(index)
              }}
              tabIndex={index === tabStop ? 0 : -1}
              role="img"
              aria-label={labelFor(index)}
              title={labelFor(index)}
              className="aspect-square rounded-[3px] outline-offset-2 focus-visible:outline-2 focus-visible:outline-accent"
              style={{ backgroundColor: cellColor(activity.commits[index], maximum) }}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.4 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{
                duration: reduceMotion ? 0 : 0.24,
                ease: EASE,
                delay: reduceMotion ? 0 : Math.floor(offset / GRID_ROWS) * 0.045,
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
