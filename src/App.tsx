import Hero from './components/Hero'
import NowStrip from './components/NowStrip'
import Page from './components/Page'
import Section from './components/Section'
import WorkingMethod from './components/WorkingMethod'

function App() {
  return (
    <Page>
      <Hero />
      <NowStrip />
      <Section id="method" label="Working Method" subline="How agent code gets to main">
        <WorkingMethod />
      </Section>
      <Section id="work" label="Selected Work" subline="Placeholder subline.">
        <p>Selected Work placeholder.</p>
      </Section>
      <Section id="build-log" label="Build Log" subline="Placeholder subline.">
        <p>Build Log teaser placeholder.</p>
      </Section>
    </Page>
  )
}

export default App
