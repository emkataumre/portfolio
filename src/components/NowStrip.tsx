const entries = [
  {
    label: 'Now',
    text: 'Software engineer at Inact. I use agentic coding to land large features fast in a large legacy codebase.',
  },
  {
    label: 'In parallel',
    text: 'At Solution 8 I work in a team that runs on agentic workflows: shared skills, shared conventions, agent-written code reviewed by peers. We build internal tools and open source material on agentic programming.',
  },
]

function NowStrip() {
  return (
    <dl className="mt-18 border-t border-line text-[0.95rem] leading-[1.5]">
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
    </dl>
  )
}

export default NowStrip
