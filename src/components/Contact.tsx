import { site } from '../site'
import Reveal from './Reveal'

function Contact() {
  return (
    <section id="contact" className="mt-20 border-t border-line py-6">
      <Reveal className="flex flex-col items-end text-right">
        <h2 className="text-base font-semibold tracking-[-0.01em]">Contact</h2>
        <a
          href={`mailto:${site.email}`}
          className="mt-2 text-sm text-muted underline decoration-line underline-offset-4 transition-colors hover:text-accent focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          {site.email}
        </a>
        <div className="mt-3 flex gap-5 font-mono text-[0.75rem]">
          <a
            href={site.github}
            target="_blank"
            rel="me noopener noreferrer"
            className="underline decoration-line underline-offset-4 transition-colors hover:text-accent focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            GitHub
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="me noopener noreferrer"
            className="underline decoration-line underline-offset-4 transition-colors hover:text-accent focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            LinkedIn
          </a>
          <a
            href={site.linktree}
            target="_blank"
            rel="me noopener noreferrer"
            className="underline decoration-line underline-offset-4 transition-colors hover:text-accent focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            Linktree
          </a>
        </div>
      </Reveal>
    </section>
  )
}

export default Contact
