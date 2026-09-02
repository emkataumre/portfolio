import Hero, { variants, type Variant } from './components/Hero'
import PrototypeSwitcher from './components/PrototypeSwitcher'
import NowStrip from './components/NowStrip'
import Page from './components/Page'
import Section from './components/Section'

function App() {
  const param = new URLSearchParams(window.location.search).get('variant')
  const variant: Variant = param && param in variants ? (param as Variant) : '1'
  return (
    <Page>
      <PrototypeSwitcher variants={variants} current={variant} />
      <Hero variant={variant} />
      <NowStrip />
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
