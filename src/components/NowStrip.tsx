import Reveal from './Reveal'

const entries = [
  {
    label: 'Now',
    date: 'May 2026 to present',
    role: 'Junior Software Engineer at Inact',
    text: 'I use agentic coding to land large features quickly and reliably in a large legacy codebase.',
  },
  {
    label: 'Before',
    date: 'Summer 2026',
    role: 'Freelance AI Engineer at Solution 8',
    text: 'At Solution 8, I worked in a team built around agentic workflows, using shared skills and conventions to reliably ship agent-written code across both internal and external products. I contributed throughout the software lifecycle, from researching and shaping product features to planning, implementation, and testing. We also built internal productivity tools and open-sourced resources around agentic development.',
  },
]

function NowStrip() {
  return (
    <Reveal as="dl" delay={0.34} className="mt-18 border-t border-line text-[0.95rem] leading-[1.5]">
      {entries.map(({ label, date, role, text }) => (
        <div
          key={label}
          className="grid grid-cols-[8px_1fr] items-start gap-x-3.5 gap-y-2 border-b border-line py-5 min-[620px]:grid-cols-[8px_92px_1fr] min-[620px]:items-baseline min-[620px]:gap-y-0 min-[620px]:py-3.5"
        >
          <span aria-hidden="true" className="mt-2 size-2 rounded-full bg-accent min-[620px]:mt-0" />
          <dt className="font-semibold">{label}</dt>
          <dd className="col-start-2 min-[620px]:col-start-auto">
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-muted">
              {date}
            </p>
            <p className="mt-1 font-semibold tracking-[-0.01em]">{role}</p>
            <p className="mt-2">{text}</p>
          </dd>
        </div>
      ))}
    </Reveal>
  )
}

export default NowStrip
