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
      <section id="activity" className="mt-24 scroll-mt-20 min-[900px]:scroll-mt-8">
        <ActivityPace>
          <ActivityGrid />
        </ActivityPace>
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
      <Section
        id="stack"
        label="Technologies"
        subline="The agents I ship with, and the stack I ship in."
      >
        <Technologies />
      </Section>
    </Page>
  )
}

export default App
