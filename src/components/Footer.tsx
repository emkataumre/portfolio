import { site } from '../site'

function Footer() {
  return (
    <footer
      id="contact"
      className="mt-30 flex items-center justify-between border-t border-line py-6 text-sm text-muted"
    >
      <span>Emil Vladinov · Copenhagen</span>
      <div className="flex gap-7">
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
