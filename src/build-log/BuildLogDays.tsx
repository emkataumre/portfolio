import { Fragment } from 'react'
import Rule from '../components/Rule'

export type Commit = {
  sha: string
  shortSha: string
  subject: string
  filesChanged: number
}

export type Day = {
  day: string
  note: string | null
  commits: Commit[]
}

type BuildLogDaysProps = {
  days: Day[]
  repoUrl: string
}

function files(count: number) {
  return count === 1 ? '1 file' : `${count} files`
}

function BuildLogDays({ days, repoUrl }: BuildLogDaysProps) {
  return (
    <div className="grid gap-12">
      {days.map(({ day, note, commits }) => (
        <article key={day}>
          <h2 className="font-mono text-[0.8125rem] font-medium">{day}</h2>
          {note && <p className="mt-2 text-muted">{note}</p>}
          {commits.length > 0 && (
            <div className="mt-4">
              {commits.map(({ sha, shortSha, subject, filesChanged }) => (
                <Fragment key={sha}>
                  <Rule />
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5 py-3 min-[760px]:grid-cols-[auto_1fr_auto]">
                    <a
                      href={`${repoUrl}/commit/${sha}`}
                      className="font-mono text-[0.8125rem] leading-[1.55] underline decoration-line underline-offset-4 hover:decoration-current"
                    >
                      {shortSha}
                    </a>
                    <p>{subject}</p>
                    <p className="col-start-2 font-mono text-[0.8125rem] text-muted min-[760px]:col-start-auto min-[760px]:text-right">
                      {files(filesChanged)}
                    </p>
                  </div>
                </Fragment>
              ))}
              <Rule />
            </div>
          )}
        </article>
      ))}
    </div>
  )
}

export default BuildLogDays
