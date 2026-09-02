import { site } from '../site'

function Footer() {
  return (
    <footer id="contact" className="mt-30 flex flex-wrap items-center justify-between gap-x-7 gap-y-2 text-sm text-muted">
      <span>Emil Vladinov · Copenhagen</span>
      <div className="flex flex-wrap gap-x-7 gap-y-2">
        <a href={`mailto:${site.email}`}>{site.email}</a>
        <a href={site.github} rel="me">
          GitHub
        </a>
        <a href={site.linkedin} rel="me">
          LinkedIn
        </a>
      </div>
    </footer>
  )
}

export default Footer
