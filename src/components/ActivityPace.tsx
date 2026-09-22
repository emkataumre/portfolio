import { useReducedMotion } from 'motion/react'
import { useState } from 'react'
import './ActivityPace.css'

const DAYS = 123
const EMIL_EVENTS = 377 + 212
const AVERAGE_EVENTS = 17 + 9

const rows = [
  {
    name: 'Emil Vladinov',
    detail: '377 commits · 212 closed assigned issues',
    initials: 'EV',
    events: EMIL_EVENTS,
    kind: 'emil',
  },
  {
    name: 'Average pace',
    detail: null,
    initials: 'A',
    events: AVERAGE_EVENTS,
    kind: 'average',
  },
] as const

function ActivityPace() {
  const reduceMotion = useReducedMotion() === true
  const [paused, setPaused] = useState(false)

  return (
    <section className="activity-pace mx-auto mt-24 w-full max-w-[720px] px-4" aria-labelledby="activity-pace-title" data-paused={paused}>
      <h2 id="activity-pace-title">Build pace<span>.</span></h2>
      <p className="activity-pace-intro">
        Two avatars travel the same short distance. Faster activity makes a faster lap.
      </p>

      <div className="activity-pace-header">
        <p>24 May – 23 Sep 2026 · {DAYS} days</p>
        {!reduceMotion && (
          <button type="button" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>
            {paused ? 'Resume motion' : 'Pause motion'}
          </button>
        )}
      </div>

      {rows.map((row) => (
        <div className={`activity-pace-lane activity-pace-lane--${row.kind}`} key={row.kind}>
          <div className="activity-pace-identity">
            <h3>{row.name}</h3>
            {row.detail && <p>{row.detail}</p>}
          </div>
          <div className="activity-pace-track" aria-hidden="true">
            <div className="activity-pace-rail" />
            <div
              className="activity-pace-avatar"
              style={{ animationDuration: `${(1.6 * Math.sqrt(EMIL_EVENTS / row.events)).toFixed(2)}s` }}
            >
              {row.initials}
            </div>
          </div>
          <p className="activity-pace-rate">
            <strong>{(row.events / DAYS).toFixed(2)}</strong>
            <span>events / day</span>
          </p>
        </div>
      ))}

      <p className="activity-pace-method">
        One event is one non-merge commit or one assigned issue closed. Motion compresses the speed gap;
        the daily rates show the measured pace.
      </p>
    </section>
  )
}

export default ActivityPace
