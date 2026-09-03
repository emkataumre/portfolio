import BuildLogTeaser from './components/BuildLogTeaser'
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
      <Section id="method" label="Working Method" subline="How agent code gets to main">
        <WorkingMethod />
      </Section>
      <Section
        id="work"
        label="Selected Work"
        subline="Inact, 2026. A legacy Go and React monorepo, 415k lines."
      >
        <SelectedWork />
      </Section>
      <Section id="build-log" label="Build Log" subline="The one thing you can verify">
        <BuildLogTeaser />
      </Section>
    </Page>
  )
}

export default App
