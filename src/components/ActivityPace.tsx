import './ActivityPace.css'

const PACE = [
  { kind: 'emil', events: 377 + 212 },
  { kind: 'average', events: 17 + 9 },
] as const
const MULTIPLE = Math.floor(PACE[0].events / PACE[1].events)

function ActivityPace() {
  return (
    <section className="activity-pace mx-auto mt-14 w-full max-w-[720px] px-4" aria-labelledby="activity-pace-title">
      <h2 id="activity-pace-title">
        <span>{MULTIPLE}×</span> the average pace
      </h2>
      <div className="activity-pace-tracks" role="img" aria-label="Two avatars compare activity pace. The first moves faster than the second.">
        {PACE.map(({ kind, events }) => (
          <div className={`activity-pace-track activity-pace-track--${kind}`} key={kind} aria-hidden="true">
            <span className="activity-pace-rail" />
            <span
              className="activity-pace-avatar"
              style={{ animationDuration: `${(1.6 * Math.sqrt(PACE[0].events / events)).toFixed(2)}s` }}
            >
              {kind === 'emil' ? 'EV' : (
                <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
                  <circle cx="16" cy="11" r="4" fill="currentColor" />
                  <path d="M7.5 25a8.5 8.5 0 0 1 17 0" fill="currentColor" />
                </svg>
              )}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ActivityPace
