import ActivityGrid from './components/ActivityGrid'
import ActivityPace from './components/ActivityPace'
import Hero from './components/Hero'
import NowStrip from './components/NowStrip'
import Page from './components/Page'
import Section from './components/Section'
import SelectedWork from './components/SelectedWork'
import Technologies from './components/Technologies'
import WorkingMethod from './components/WorkingMethod'

function App() {
  return (
    <Page>
      <Hero />
      <NowStrip />
      <section id="activity" className="mt-24">
        <ActivityGrid />
        <ActivityPace />
      </section>
      <Section
        id="method"
        label="Working Method"
        subline="My own, refined way of working that gets agent code from a plan through to production."
        wideContent
      >
        <WorkingMethod />
      </Section>
      <Section
        id="work"
        label="Selected Work"
        subline="Inact, 2026. A legacy Go and React codebase. 400 000+ lines."
      >
        <SelectedWork />
      </Section>
      <section className="mt-24">
        <div className="mx-auto w-full max-w-[720px] px-4">
          <Technologies />
        </div>
      </section>
    </Page>
  )
}

export default App
