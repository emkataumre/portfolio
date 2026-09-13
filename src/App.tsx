import ActivityGrid from './components/ActivityGrid'
import Hero from './components/Hero'
import NowStrip from './components/NowStrip'
import Page from './components/Page'
import Section from './components/Section'
import SelectedWork from './components/SelectedWork'
import WorkingMethod from './components/WorkingMethod'

function App() {
  return (
    <Page>
      <Hero />
      <NowStrip />
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
      <section id="activity" className="mt-24">
        <ActivityGrid />
      </section>
    </Page>
  )
}

export default App
