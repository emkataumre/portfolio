const principles = [
  {
    title: 'Plan first',
    body: 'Every feature starts as a map of decisions. No code until the questions have answers.',
  },
  {
    title: 'Argue the plan',
    body: 'The agent interrogates the plan before it builds. Weak ideas die on paper.',
  },
  {
    title: 'Small steps with tests',
    body: 'One change at a time. A failing test first, where the codebase allows it.',
  },
  {
    title: 'Review in passes',
    body: 'Security, dead code, duplication, error handling. Each pass runs in a fresh context.',
  },
  {
    title: 'Verify at runtime',
    body: 'The agent drives the app and queries the database before it says "done".',
  },
]

function WorkingMethod() {
  return (
    <>
      <p className="mb-7 text-muted">
        At Inact, this method has put about 21k lines of agent-written code through senior
        review.
      </p>
      <div className="grid gap-x-8 gap-y-7 min-[760px]:grid-cols-2">
        {principles.map(({ title, body }) => (
          <div key={title} className="last:min-[760px]:col-span-2">
            <h3 className="text-base font-semibold tracking-[-0.01em]">{title}</h3>
            <p className="mt-1 text-muted">{body}</p>
          </div>
        ))}
      </div>
      <div
        className="relative mt-8 flex aspect-[16/9] items-center justify-center rounded-[10px] border border-line bg-[color-mix(in_oklab,var(--color-muted)_8%,var(--color-surface))]"
      >
        <span
          aria-hidden="true"
          className="flex size-12 items-center justify-center rounded-full bg-accent min-[760px]:size-14"
        >
          <span className="ml-1 border-y-[10px] border-l-[16px] border-y-transparent border-l-white" />
        </span>
        <span className="absolute bottom-3 left-3.5 right-3.5 font-mono text-[0.8125rem] text-balance text-muted">
          One feature, from map to production. 40 s, with music.
        </span>
      </div>
      <p className="mt-6 text-muted">
        The team version of this method is public:{' '}
        <a
          href="https://github.com/solution8-com/agentic-playbook"
          className="text-accent underline-offset-2 hover:underline"
        >
          the Solution 8 agentic playbook
        </a>
        .
      </p>
    </>
  )
}

export default WorkingMethod
