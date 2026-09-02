import Container from '../components/Container'
import Footer from '../components/Footer'
import Nav from '../components/Nav'
import Section from '../components/Section'

function BuildLog() {
  return (
    <div className="min-h-screen bg-bg font-sans text-text">
      <Container>
        <Nav base="/" />
        <main>
          <Section
            id="build-log"
            label="Build Log"
            subline="How this site was built, day by day."
            headingLevel="h1"
          >
            <p>Build Log placeholder.</p>
          </Section>
        </main>
        <Footer />
      </Container>
    </div>
  )
}

export default BuildLog
