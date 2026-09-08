import { useId, useRef, useState } from 'react'
import activity from '../activity/activity.json'
import Reveal from './Reveal'

const RANGES = [7, 30, 365] as const
type Range = (typeof RANGES)[number]

const mix = (percent: number) =>
  `color-mix(in oklab, var(--color-accent) ${percent}%, transparent)`

/** Commit counts that start each accent step. A day under the first step uses `line`. */
const STEPS = [
  { min: 14, color: 'var(--color-accent)' },
  { min: 7, color: mix(80) },
  { min: 4, color: mix(62) },
  { min: 3, color: mix(46) },
  { min: 1, color: 'var(--color-accent-soft)' },
]

function cellColor(count: number) {
  return STEPS.find((step) => count >= step.min)?.color ?? 'var(--color-line)'
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

/** Monday is 0. */
function weekday(day: Date) {
  return (day.getUTCDay() + 6) % 7
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
  const [range, setRange] = useState<Range>(365)
  const [hovered, setHovered] = useState<number | null>(null)
  const [focused, setFocused] = useState<number | null>(null)
  // The tab stop remembers the last cell the keyboard reached, so the grid keeps
  // one tab stop and returns to where it was.
  const [visited, setVisited] = useState<number | null>(null)
  const cellRefs = useRef(new Map<number, HTMLDivElement>())
  const titleId = useId()
  const hintId = useId()

  const total = activity.commits.length
  const start = Math.max(0, total - range)
  const indexes = Array.from({ length: total - start }, (_, offset) => start + offset)
  const isYear = range === 365
  const pad = isYear ? weekday(dayAt(start)) : 0
  const tabStop = visited ?? start

  const move = (from: number, delta: number) => {
    const next = Math.min(total - 1, Math.max(start, from + delta))
    setVisited(next)
    cellRefs.current.get(next)?.focus()
  }

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const rowsPerColumn = isYear ? 7 : 1
    const step =
      event.key === 'ArrowRight'
        ? rowsPerColumn
        : event.key === 'ArrowLeft'
          ? -rowsPerColumn
          : isYear && event.key === 'ArrowDown'
            ? 1
            : isYear && event.key === 'ArrowUp'
              ? -1
              : 0
    if (step === 0) return
    event.preventDefault()
    move(index, step)
  }

  const readout = hovered ?? focused

  return (
    <Reveal>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <p id={titleId} className="font-semibold">
          Commits
        </p>
        <div className="flex gap-4 font-mono text-[0.8125rem]">
          {RANGES.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={option === range}
              onClick={() => {
                setRange(option)
                setVisited(null)
                setFocused(null)
                setHovered(null)
              }}
              className={
                option === range
                  ? 'text-accent underline underline-offset-2'
                  : 'text-muted underline-offset-2 hover:underline'
              }
            >
              {option} days
            </button>
          ))}
        </div>
      </div>

      <p id={hintId} className="sr-only">
        Use the arrow keys to move between days.
      </p>

      <div className="mt-4 min-w-0 overflow-hidden">
        <div
          role="group"
          aria-labelledby={titleId}
          aria-describedby={hintId}
          className="grid w-full gap-[clamp(1px,0.25vw,3px)] [grid-auto-flow:column]"
          style={{
            gridTemplateColumns: `repeat(${isYear ? 53 : indexes.length}, minmax(0, 11px))`,
            gridTemplateRows: `repeat(${isYear ? 7 : 1}, auto)`,
          }}
        >
          {Array.from({ length: pad }, (_, slot) => (
            <div key={`pad-${slot}`} aria-hidden="true" />
          ))}
          {indexes.map((index) => (
            <div
              key={index}
              ref={(node) => {
                if (node) cellRefs.current.set(index, node)
                else cellRefs.current.delete(index)
              }}
              tabIndex={index === tabStop ? 0 : -1}
              role="img"
              aria-label={labelFor(index)}
              className="aspect-square rounded-[2px] outline-offset-2"
              style={{ backgroundColor: cellColor(activity.commits[index]) }}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered((current) => (current === index ? null : current))}
              onFocus={() => {
                setVisited(index)
                setFocused(index)
              }}
              onBlur={() => setFocused((current) => (current === index ? null : current))}
              onKeyDown={(event) => onKeyDown(event, index)}
            />
          ))}
        </div>
      </div>

      <p className="mt-3 h-5 font-mono text-[0.8125rem] text-muted">
        {readout === null ? '' : labelFor(readout)}
      </p>
    </Reveal>
  )
}

export default ActivityGrid
