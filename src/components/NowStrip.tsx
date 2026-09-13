import Reveal from './Reveal'

const entries = [
  {
    label: 'Now',
    text: 'Software engineer at Inact. I use agentic coding to land large features quickly and reliably in a large legacy codebase.',
  },
  {
    label: 'Also',
    text: 'At Solution 8 I worked in a team that runs on agentic workflows: we used shared skills, shared conventions, and shipped agent-written code reliably. We also built internal productivity boosting tools and open sourced material on agentic development.',
  },
]

function NowStrip() {
  return (
    <Reveal as="dl" delay={0.34} className="mt-18 border-t border-line text-[0.95rem] leading-[1.5]">
      {entries.map(({ label, text }) => (
        <div
          key={label}
          className="grid grid-cols-[8px_92px_1fr] items-baseline gap-3.5 border-b border-line py-3.5"
        >
          <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
          <dt className="font-semibold">{label}</dt>
          <dd>{text}</dd>
        </div>
      ))}
    </Reveal>
  )
}

export default NowStrip
