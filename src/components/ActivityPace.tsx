import type { ReactNode } from 'react'
import './ActivityPace.css'

const PACE = [
  { kind: 'emil', events: 377 + 212 },
  { kind: 'average', events: 17 + 9 },
] as const
const MULTIPLE = Math.floor(PACE[0].events / PACE[1].events)
/** Seconds for one lap of the fastest avatar. A square root compresses the gap, so the slow avatar still moves. */
const LAP_SECONDS = 9

/** The dark activity box is the track. Two avatars lap its outline at their relative pace. */
function ActivityPace({ children }: { children: ReactNode }) {
  return (
    <section className="activity-pace" aria-labelledby="activity-pace-title">
      <h2 id="activity-pace-title">
        <span>{MULTIPLE}×</span> the average pace
      </h2>
      <div className="activity-pace-lap">
        <div className="dark-band relative overflow-hidden rounded-[28px] bg-surface py-16 text-text min-[760px]:py-20">
          {children}
        </div>
        <div className="activity-pace-runners" role="img" aria-label="Two avatars lap the box. The first laps faster than the second.">
          {PACE.map(({ kind, events }) => (
            <span
              className={`activity-pace-avatar activity-pace-avatar--${kind}`}
              key={kind}
              aria-hidden="true"
              style={{ animationDuration: `${(LAP_SECONDS * Math.sqrt(PACE[0].events / events)).toFixed(2)}s` }}
            >
              {kind === 'emil' ? 'EV' : (
                <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
                  <circle cx="16" cy="11" r="4" fill="currentColor" />
                  <path d="M7.5 25a8.5 8.5 0 0 1 17 0" fill="currentColor" />
                </svg>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ActivityPace
