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

const shipStages = [
  ['Brief', 'Scope and success criteria'],
  ['Build', 'The agreed change'],
  ['Independent review', 'Code and brief'],
]

const verificationStages = [
  'Map and atomize claims',
  'Plan path coverage',
  'Attack the runtime',
  'Audit raw evidence',
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
      <div className="min-[760px]:col-start-2">
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
      </div>
      <Reveal as="div" className="mt-10 min-[760px]:col-span-2 min-[760px]:mt-0">
        <section aria-labelledby="workflow-title">
          <div className="border-b border-line pb-3">
            <h3 id="workflow-title" className="text-base font-semibold tracking-[-0.01em]">
              Under the hood
            </h3>
          </div>

          <svg
            viewBox="0 0 976 530"
            role="img"
            aria-labelledby="workflow-map-title workflow-map-description"
            className="mt-5 hidden w-full min-[760px]:block"
          >
            <title id="workflow-map-title">Ship and Verify Feature workflow</title>
            <desc id="workflow-map-description">
              Ship owns the path from brief through build and independent review. Verify Feature
              maps claims, plans coverage, attacks the runtime, and audits evidence. Pass returns to
              Ship for authorized delivery. Fail returns to Ship for repair and then verification.
              Blocked stops green delivery.
            </desc>
            <defs>
              <marker id="workflow-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                <path d="M0 0 8 4 0 8Z" className="fill-muted" />
              </marker>
              <marker id="workflow-arrow-accent" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                <path d="M0 0 8 4 0 8Z" className="fill-accent" />
              </marker>
            </defs>

            <rect x="1" y="1" width="974" height="528" rx="12" className="fill-surface stroke-line" />
            <g className="fill-none stroke-muted" strokeWidth="1.25" markerEnd="url(#workflow-arrow)">
              <path d="M240 66H315" />
              <path d="M525 66H600" />
              <path d="M725 100V124H488V148" />
            </g>

            {shipStages.map(([title, body], index) => {
              const x = [30, 315, 600][index]
              const width = index === 2 ? 250 : 210
              return (
                <g key={title}>
                  <rect x={x} y="32" width={width} height="68" rx="10" className="fill-bg stroke-line" />
                  <text x={x + 16} y="58" className="fill-text text-[15px] font-semibold">
                    {title}
                  </text>
                  <text x={x + 16} y="81" className="fill-muted text-[13px]">
                    {body}
                  </text>
                </g>
              )
            })}

            <g>
              <rect x="30" y="150" width="916" height="154" rx="12" className="fill-accent-soft stroke-accent" />
              <text x="54" y="177" className="fill-accent text-[12px] font-semibold tracking-[0.08em]">
                VERIFY FEATURE
              </text>
              <text x="174" y="177" className="fill-muted text-[12px]">
                independent adversarial check
              </text>
              <g className="fill-none stroke-accent" strokeWidth="1.25" markerEnd="url(#workflow-arrow-accent)">
                <path d="M244 240H276" />
                <path d="M470 240H502" />
                <path d="M696 240H728" />
              </g>
              {verificationStages.map((stage, index) => {
                const x = [54, 280, 506, 732][index]
                const lines = [
                  ['Map and atomize', 'claims'],
                  ['Plan path', 'coverage'],
                  ['Attack the', 'runtime'],
                  ['Audit raw', 'evidence'],
                ][index]
                return (
                  <g key={stage}>
                    <rect x={x} y="198" width="190" height="84" rx="10" className="fill-surface stroke-line" />
                    <circle cx={x + 18} cy="218" r="9" className="fill-accent-soft stroke-accent" />
                    <text x={x + 18} y="222" textAnchor="middle" className="fill-accent text-[10px] font-semibold">
                      {index + 1}
                    </text>
                    <text x={x + 14} y="248" className="fill-text text-[14px] font-semibold">
                      <tspan x={x + 14}>{lines[0]}</tspan>
                      <tspan x={x + 14} dy="19">{lines[1]}</tspan>
                    </text>
                  </g>
                )
              })}
            </g>

            <path d="M488 304V319" className="fill-none stroke-muted" strokeWidth="1.25" markerEnd="url(#workflow-arrow)" />
            <path d="M488 318 558 362 488 406 418 362Z" className="fill-bg stroke-text" strokeWidth="1.25" />
            <text x="488" y="358" textAnchor="middle" className="fill-text text-[13px] font-semibold">
              RESULT?
            </text>
            <text x="488" y="375" textAnchor="middle" className="fill-muted text-[10px]">
              evidence decides
            </text>

            <g className="fill-none stroke-muted" strokeWidth="1.25" markerEnd="url(#workflow-arrow)">
              <path d="M418 362H180V434" />
              <path d="M488 406V434" />
            </g>
            <path d="M558 362H796V434" className="fill-none stroke-accent" strokeWidth="1.25" markerEnd="url(#workflow-arrow-accent)" />

            <g>
              <rect x="50" y="436" width="260" height="72" rx="10" className="fill-bg stroke-line" />
              <text x="66" y="459" className="fill-text text-[11px] font-semibold tracking-[0.08em]">FAIL</text>
              <text x="66" y="480" className="fill-text text-[14px] font-semibold">Ship reproduces and repairs</text>
              <text x="66" y="499" className="fill-muted text-[11px]">Affected checks return to Verify</text>

              <rect x="358" y="436" width="260" height="72" rx="10" className="fill-bg stroke-line" />
              <text x="374" y="459" className="fill-muted text-[11px] font-semibold tracking-[0.08em]">BLOCKED</text>
              <text x="374" y="480" className="fill-text text-[14px] font-semibold">No green delivery</text>
              <text x="374" y="499" className="fill-muted text-[11px]">Missing proof stops the path</text>

              <rect x="666" y="436" width="260" height="72" rx="10" className="fill-accent-soft stroke-accent" />
              <text x="682" y="459" className="fill-accent text-[11px] font-semibold tracking-[0.08em]">PASS</text>
              <text x="682" y="480" className="fill-text text-[14px] font-semibold">Ship finalizes and delivers</text>
              <text x="682" y="499" className="fill-muted text-[11px]">Only when authorized</text>
            </g>

            <path
              d="M50 472H16V174H28"
              className="fill-none stroke-muted"
              strokeWidth="1.25"
              strokeDasharray="4 4"
              markerEnd="url(#workflow-arrow)"
            />
          </svg>

          <div className="mt-5 rounded-xl border border-line bg-surface p-4 min-[760px]:hidden">
            <ol aria-label="Ship workflow">
              {shipStages.map(([title, body]) => (
                <li key={title} className="relative pb-8 pl-5 last:pb-7">
                  <span className="absolute top-2 bottom-0 left-0 border-l border-muted" aria-hidden="true" />
                  <span className="absolute top-2 left-[-3px] size-[7px] rounded-full bg-muted" aria-hidden="true" />
                  <div className="rounded-[10px] border border-line bg-bg px-4 py-3">
                    <h4 className="text-sm font-semibold">{title}</h4>
                    <p className="mt-0.5 text-xs text-muted">{body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="relative rounded-[10px] border border-accent bg-accent-soft p-4">
              <span className="absolute -top-7 left-4 h-7 border-l border-accent" aria-hidden="true" />
              <h4 className="text-xs font-semibold tracking-[0.08em] text-accent">VERIFY FEATURE</h4>
              <p className="mt-1 text-xs text-muted">Independent adversarial check</p>
              <ol className="mt-4 space-y-3">
                {verificationStages.map((stage, index) => (
                  <li key={stage} className="flex items-center gap-3 rounded-lg border border-line bg-surface px-3 py-2.5 text-sm font-semibold">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-accent text-[0.625rem] text-accent" aria-hidden="true">
                      {index + 1}
                    </span>
                    {stage}
                  </li>
                ))}
              </ol>
            </div>

            <div className="mx-auto h-7 w-px bg-muted" aria-hidden="true" />
            <div className="mx-auto flex size-24 rotate-45 items-center justify-center border border-text bg-bg">
              <span className="-rotate-45 text-center text-xs font-semibold">RESULT?</span>
            </div>
            <div className="mx-auto h-7 w-px bg-muted" aria-hidden="true" />

            <div className="space-y-3">
              <div className="rounded-[10px] border border-accent bg-accent-soft px-4 py-3">
                <p className="text-xs font-semibold tracking-[0.08em] text-accent">PASS</p>
                <p className="mt-1 text-sm font-semibold">Ship finalizes and makes the authorized delivery.</p>
              </div>
              <div className="rounded-[10px] border border-line bg-bg px-4 py-3">
                <p className="text-xs font-semibold tracking-[0.08em]">FAIL</p>
                <p className="mt-1 text-sm font-semibold">Ship reproduces and repairs the defect.</p>
                <p className="mt-1 text-xs text-muted">Affected checks return to Verify Feature.</p>
              </div>
              <div className="rounded-[10px] border border-line bg-bg px-4 py-3">
                <p className="text-xs font-semibold tracking-[0.08em] text-muted">BLOCKED</p>
                <p className="mt-1 text-sm font-semibold">Missing proof stops green delivery.</p>
              </div>
            </div>
          </div>
        </section>
      </Reveal>
      <Reveal as="p" className="mt-6 text-muted min-[760px]:col-start-2 min-[760px]:mt-0">
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
