import Container from './components/Container'
import Footer from './components/Footer'
import Nav from './components/Nav'
import Section from './components/Section'

function App() {
  return (
    <div className="min-h-screen bg-bg font-sans text-text">
      <Container>
        <Nav />
        <main>
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
        </main>
        <Footer />
      </Container>
    </div>
  )
}

export default App
