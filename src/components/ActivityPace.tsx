import Reveal from './Reveal'
import './ActivityPace.css'

const DAYS = 123
const PACE = [
  { kind: 'emil', label: 'EV', events: 377 + 212 },
  { kind: 'average', label: 'Average', events: 17 + 9 },
] as const
const MULTIPLE = Math.floor(PACE[0].events / PACE[1].events)

function ActivityPace() {
  return (
    <Reveal className="activity-pace mx-auto mt-14 w-full max-w-[720px] px-4">
      <section aria-labelledby="activity-pace-title">
        <div className="activity-pace-head">
          <h2 id="activity-pace-title">
            <span>{MULTIPLE}×</span> the average pace
          </h2>
          <p>Commits and closed issues per day, last {DAYS} days.</p>
        </div>
        <ul className="activity-pace-lanes">
          {PACE.map(({ kind, label, events }) => (
            <li className={`activity-pace-lane activity-pace-lane--${kind}`} key={kind}>
              <span className="activity-pace-label">{label}</span>
              <span className="activity-pace-track" aria-hidden="true">
                <span
                  className="activity-pace-dot"
                  style={{ animationDuration: `${(1.6 * Math.sqrt(PACE[0].events / events)).toFixed(2)}s` }}
                />
              </span>
              <span className="activity-pace-rate">
                {(events / DAYS).toFixed(2)}
                <small> / day</small>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </Reveal>
  )
}

export default ActivityPace
