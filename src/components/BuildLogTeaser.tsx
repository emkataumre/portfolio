import { Fragment } from 'react'
import { type Day } from '../build-log/BuildLogDays'
import data from '../build-log/build-log.json'
import Reveal from './Reveal'
import Rule from './Rule'

/** The three most recent days that carry a note. Notes come from the annotations file, so fallback changes nothing here. */
const days = (data.days as Day[]).filter((day) => day.note).slice(0, 3)

function BuildLogTeaser() {
  return (
    <>
      <div>
        {days.map(({ day, note }) => (
          <Fragment key={day}>
            <Rule />
            <Reveal className="grid gap-2 py-[22px] min-[760px]:grid-cols-[110px_1fr] min-[760px]:gap-6">
              <p className="font-mono text-[0.8125rem] font-medium">{day}</p>
              <p className="text-muted">{note}</p>
            </Reveal>
          </Fragment>
        ))}
        <Rule />
      </div>
      <p className="mt-6">
        <a href="/build-log/" className="text-accent underline-offset-2 hover:underline">
          Read the full Build Log →
        </a>
      </p>
    </>
  )
}

export default BuildLogTeaser
