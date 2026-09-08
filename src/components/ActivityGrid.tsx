import { useRef, useState } from 'react'
import activity from '../activity/activity.json'

/** Cell edge and gap in pixels. The pitch is 14 px, so 53 columns fit the 1040 px page. */
const CELL = 11
const GAP = 3

const RANGES = [7, 30, 365] as const
type Range = (typeof RANGES)[number]

/** Commit counts that start each accent step. A day below the first step uses `line`. */
const STEPS = [
  { min: 14, color: 'color-mix(in oklab, var(--color-accent) 100%, transparent)' },
  { min: 7, color: 'color-mix(in oklab, var(--color-accent) 78%, transparent)' },
  { min: 4, color: 'color-mix(in oklab, var(--color-accent) 56%, transparent)' },
  { min: 3, color: 'color-mix(in oklab, var(--color-accent) 34%, transparent)' },
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

function readoutFor(index: number) {
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
  const cellRefs = useRef(new Map<number, HTMLDivElement>())

  const total = activity.commits.length
  const start = total - range
  const indexes = Array.from({ length: range }, (_, offset) => start + offset)
  const isYear = range === 365
  const pad = isYear ? weekday(dayAt(start)) : 0

  // One tab stop reaches the grid. Arrow keys then move focus between cells.
  const tabStop = focused ?? start

  const move = (from: number, delta: number) => {
    const next = Math.min(total - 1, Math.max(start, from + delta))
    setFocused(next)
    cellRefs.current.get(next)?.focus()
  }

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const column = isYear ? 7 : 1
    const step =
      event.key === 'ArrowRight'
        ? column
        : event.key === 'ArrowLeft'
          ? -column
          : isYear && event.key === 'ArrowDown'
            ? 1
            : isYear && event.key === 'ArrowUp'
              ? -1
              : 0
    if (step === 0) return
    event.preventDefault()
    move(index, step)
  }

  const shown = hovered ?? focused

  return (
    <div>
      <div className="flex gap-4 font-mono text-[0.8125rem]">
        {RANGES.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={option === range}
            onClick={() => {
              setRange(option)
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

      <div className="mt-4 overflow-x-auto">
        <div
          role="group"
          aria-label="Commits per day"
          className="grid w-max"
          style={{
            gap: `${GAP}px`,
            gridAutoFlow: 'column',
            gridAutoColumns: `${CELL}px`,
            gridTemplateRows: `repeat(${isYear ? 7 : 1}, ${CELL}px)`,
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
              aria-label={readoutFor(index)}
              className="rounded-[2px] outline-offset-2"
              style={{ backgroundColor: cellColor(activity.commits[index]) }}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered((current) => (current === index ? null : current))}
              onFocus={() => setFocused(index)}
              onBlur={() => setFocused((current) => (current === index ? null : current))}
              onKeyDown={(event) => onKeyDown(event, index)}
            />
          ))}
        </div>
      </div>

      <p aria-live="polite" className="mt-3 h-5 font-mono text-[0.8125rem] text-muted">
        {shown === null ? '' : readoutFor(shown)}
      </p>
    </div>
  )
}

export default ActivityGrid
