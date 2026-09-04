import { useLayoutEffect, useRef, useState } from 'react'
import Reveal from './Reveal'

/** The share of the viewport that the playing video fills. */
const PLAY_FILL = 0.92

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
  const frameRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // While the video plays it moves to the middle of the screen and grows. The
  // element stays in the flow, so playback survives: only a transform moves it.
  // The page scroll is locked, which keeps the centred box correct without a
  // scroll listener fighting the 500 ms transition.
  useLayoutEffect(() => {
    const video = videoRef.current
    if (!playing || !video) return
    const { body, documentElement } = document
    const barWidth = window.innerWidth - documentElement.clientWidth
    body.style.overflow = 'hidden'
    body.style.paddingRight = `${barWidth}px`

    // The transform goes straight on the node. State would re-render the video
    // element on every resize, and React owns no other part of this value.
    const place = () => {
      const box = frameRef.current?.getBoundingClientRect()
      if (!box) return
      const width = Math.min(window.innerWidth, (window.innerHeight * 16) / 9) * PLAY_FILL
      const x = window.innerWidth / 2 - (box.left + box.width / 2)
      const y = window.innerHeight / 2 - (box.top + box.height / 2)
      video.style.transform = `translate(${x}px, ${y}px) scale(${width / box.width})`
    }
    place()
    window.addEventListener('resize', place)

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') videoRef.current?.pause()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      video.style.transform = ''
      body.style.overflow = ''
      body.style.paddingRight = ''
      window.removeEventListener('resize', place)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [playing])

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
        <div
          className={`fixed inset-0 z-40 bg-bg/85 transition-opacity duration-500 ease-out ${playing ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          onClick={() => videoRef.current?.pause()}
          aria-hidden="true"
        />
        <div ref={frameRef} className="aspect-[16/9] w-full">
          <video
            ref={videoRef}
            className="relative z-50 h-full w-full rounded-[10px] border border-line bg-[#0b0b0c] transition-transform duration-500 ease-out motion-reduce:transition-none"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            src="/working-method.mp4"
            poster="/working-method-poster.jpg"
            controls
            playsInline
            preload="metadata"
            aria-label="One feature, from idea to production, in 69 seconds. Silent."
          />
        </div>
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
