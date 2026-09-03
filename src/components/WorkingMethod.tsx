import { useState } from 'react'
import Reveal from './Reveal'

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
  const [playing, setPlaying] = useState(false)
  return (
    <>
      <Reveal as="p" className="mb-7 text-muted">
        At Inact, this method has put about 21k lines of agent-written code through senior
        review.
      </Reveal>
      <div className="grid gap-x-8 gap-y-7 min-[760px]:grid-cols-2">
        {principles.map(({ title, body }) => (
          <Reveal key={title} className="last:min-[760px]:col-span-2">
            <h3 className="text-base font-semibold tracking-[-0.01em]">{title}</h3>
            <p className="mt-1 text-muted">{body}</p>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-8">
        <video
          className={`aspect-[16/9] w-full rounded-[10px] border border-line bg-[#0b0b0c] transition-transform duration-500 ease-out motion-reduce:transform-none ${playing ? 'scale-[1.04]' : ''}`}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          src="/working-method.mp4"
          poster="/working-method-poster.jpg"
          controls
          playsInline
          preload="metadata"
          aria-label="One feature, from idea to production, in 53 seconds. Silent."
        />
        <p className="mt-2 font-mono text-[0.8125rem] text-muted">
          One feature, from idea to production. 53 s, silent.
        </p>
      </Reveal>
      <Reveal as="p" className="mt-6 text-muted">
        The team version of this method is public:{' '}
        <a
          href="https://github.com/solution8-com/agentic-playbook"
          className="text-accent underline-offset-2 hover:underline"
        >
          the Solution 8 agentic playbook
        </a>
        .
      </Reveal>
    </>
  )
}

export default WorkingMethod
