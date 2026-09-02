import Page from './components/Page'
import Section from './components/Section'

function App() {
  return (
    <Page>
      <section className="mt-22">
        <h1>Hero placeholder</h1>
      </section>
      <Section id="method" label="Working Method" subline="Placeholder subline.">
        <p>Working Method placeholder.</p>
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
