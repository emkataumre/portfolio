import Page from '../components/Page'
import Section from '../components/Section'
import BuildLogDays, { type Day } from './BuildLogDays'
import data from './build-log.json'

type BuildLogData = {
  repoUrl: string
  source: 'git' | 'fallback'
  days: Day[]
}

const log = data as BuildLogData
const { repoUrl, source } = log

/** In fallback the page shows the notes alone, whatever the generator emitted. */
const days =
  source === 'fallback'
    ? log.days.map((day) => ({ ...day, commits: [] }))
    : log.days

const linkClass = 'underline decoration-line underline-offset-4 hover:decoration-current'

function BuildLog() {
  return (
    <Page>
      <Section
        id="build-log"
        label="Build Log"
        subline="How this site was built, day by day."
        headingLevel="h1"
      >
        <p className="text-muted">
          Planning lives in the repo:{' '}
          <a href={`${repoUrl}/tree/main/.scratch/portfolio-spec`} className={linkClass}>
            the map, its tickets, research notes, and prototypes
          </a>
          .
        </p>
        {source === 'fallback' && (
          <p className="mt-2 text-muted">
            Commit history was not available at build time. See{' '}
            <a href={repoUrl} className={linkClass}>
              the repository on GitHub
            </a>
            .
          </p>
        )}
        <div className="mt-10">
          <BuildLogDays days={days} repoUrl={repoUrl} />
        </div>
      </Section>
    </Page>
  )
}

export default BuildLog
