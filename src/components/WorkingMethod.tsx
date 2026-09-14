import { useLayoutEffect, useRef, useState } from 'react'
import Reveal from './Reveal'

const principles = [
  {
    title: 'Plan first',
    body: 'Every feature starts as a map of decisions, both architectural and behavioral.',
  },
  {
    title: 'Argue the plan',
    body: 'Agents interrogate the plan before it gets promoted. Weak ideas and shaky architecture die in this phase.',
  },
  {
    title: 'Small steps with tests',
    body: 'Features are implemented and tested incrementally, adhering to thorough agenting coding verification concepts.',
  },
  {
    title: 'Review in passes',
    body: 'Security, dead code, duplication, error handling. Each error caught is surfaced back up the pipeline for fixes and re-review.',
  },
  {
    title: 'Verify at runtime',
    body: 'The agents drive the app, query, the database, exercise the API and attempt to break the new code. Edge-cases surface here and are propped up the pipeline for fixes and re-review.',
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
  const [expanded, setExpanded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // The video stays mounted while a fixed wrapper moves it above the page.
  // Native media controls break seek coordinates when the video or an ancestor
  // is scaled with a CSS transform, so the expanded player uses viewport units.
  useLayoutEffect(() => {
    const video = videoRef.current
    if (!expanded || !video) return
    const { body, documentElement } = document
    const playbackScrollY = window.scrollY
    const barWidth = window.innerWidth - documentElement.clientWidth
    body.style.overflow = 'hidden'
    body.style.paddingRight = `${barWidth}px`

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        video.pause()
        setExpanded(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      body.style.overflow = ''
      body.style.paddingRight = ''
      window.scrollTo(0, playbackScrollY)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [expanded])

  const closePlayer = () => {
    videoRef.current?.pause()
    setExpanded(false)
  }

  return (
    <>
      <div className="min-[760px]:col-start-2">
      <Reveal as="p" className="mb-7 text-muted">
        At Inact, this method has put about 30,000 lines of agent-written code through senior
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
          className={`fixed inset-0 z-40 bg-bg/85 transition-opacity duration-500 ease-out ${expanded ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          onClick={closePlayer}
          aria-hidden="true"
        />
        <div className="aspect-[16/9] w-full">
          <div
            className={
              expanded
                ? 'pointer-events-none fixed inset-0 z-50 grid place-items-center'
                : 'h-full w-full'
            }
          >
            <video
              ref={videoRef}
              className={`pointer-events-auto aspect-video rounded-[10px] border border-line bg-[#0b0b0c] ${
                expanded ? 'w-[min(92vw,calc(92vh*16/9))]' : 'h-full w-full'
              }`}
              onPlay={() => setExpanded(true)}
              onEnded={() => setExpanded(false)}
              src="https://cdn.jsdelivr.net/gh/emkataumre/portfolio@df6d49c92827df90db8de06085577a073dddfd9b/public/working-method.mp4"
              poster="/working-method-poster.jpg"
              controls
              playsInline
              preload="metadata"
              aria-label="One feature, from idea to production, in 69 seconds. Silent."
            />
          </div>
        </div>
      </Reveal>
      </div>
      <Reveal as="div" className="min-[760px]:col-span-2 min-[760px]:mt-0">
        <section aria-labelledby="workflow-title">
          <div className="border-b border-line pb-3">
            <h3 id="workflow-title" className="text-base font-semibold tracking-[-0.01em]">
              Under the hood
            </h3>
          </div>

          <div
            className="mt-5 hidden overflow-hidden rounded-xl border border-line bg-surface p-7 min-[1100px]:block"
            aria-label="Ship and Verify Feature workflow"
          >
            <p className="sr-only">
              Ship owns the path from brief through build and independent review. Verify Feature
              maps claims, plans coverage, attacks the runtime, and audits evidence. Pass returns to
              Ship for authorized delivery. Fail returns to Ship for repair and then verification.
              Blocked stops green delivery.
            </p>

            <ol className="grid grid-cols-3 gap-9" aria-label="Ship workflow">
              {shipStages.map(([title, body], index) => (
                <li
                  key={title}
                  className="relative min-h-24 rounded-xl border border-line bg-bg px-5 py-4"
                >
                  <h4 className="text-[0.9375rem] leading-5 font-semibold tracking-[-0.01em]">
                    {title}
                  </h4>
                  <p className="mt-1 text-[0.8125rem] leading-5 text-muted">{body}</p>
                  {index < shipStages.length - 1 && (
                    <span aria-hidden="true">
                      <span className="absolute top-1/2 left-full h-px w-9 bg-muted" />
                      <span className="absolute top-1/2 -right-9 -translate-y-1/2 border-y-[4px] border-l-[6px] border-y-transparent border-l-muted" />
                    </span>
                  )}
                </li>
              ))}
            </ol>

            <div className="relative h-10" aria-hidden="true">
              <span className="absolute top-0 right-1/6 h-5 w-1/3 border-r border-b border-muted" />
              <span className="absolute top-5 left-1/2 h-5 border-l border-muted" />
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 border-x-[4px] border-t-[6px] border-x-transparent border-t-muted" />
            </div>

            <div className="rounded-xl border border-accent bg-accent-soft p-5">
              <div className="flex items-baseline gap-3">
                <h4 className="text-sm font-semibold tracking-[-0.01em] text-accent">
                  Verify Feature
                </h4>
                <p className="text-[0.8125rem] text-text/65">Independent adversarial check</p>
              </div>
              <ol className="mt-4 grid grid-cols-4 gap-4">
                {verificationStages.map((stage, index) => (
                  <li
                    key={stage}
                    className="relative flex min-h-24 flex-col gap-4 rounded-xl border border-line bg-surface p-4"
                  >
                    <span className="text-[0.6875rem] leading-none font-semibold tabular-nums text-accent">
                      0{index + 1}
                    </span>
                    <span className="max-w-[9rem] text-[0.875rem] leading-[1.35] font-semibold tracking-[-0.01em]">
                      {stage}
                    </span>
                    {index < verificationStages.length - 1 && (
                      <span aria-hidden="true">
                        <span className="absolute top-1/2 left-full h-px w-4 bg-accent" />
                        <span className="absolute top-1/2 -right-4 -translate-y-1/2 border-y-[4px] border-l-[6px] border-y-transparent border-l-accent" />
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </div>

            <div className="relative mx-auto h-7 w-px bg-muted" aria-hidden="true">
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 border-x-[4px] border-t-[6px] border-x-transparent border-t-muted" />
            </div>

            <div className="relative h-36" aria-hidden="true">
              <svg viewBox="0 0 900 144" preserveAspectRatio="none" className="absolute inset-0 size-full">
                <defs>
                  <marker id="workflow-branch-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                    <path d="M0 0 8 4 0 8Z" className="fill-muted" />
                  </marker>
                  <marker id="workflow-pass-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                    <path d="M0 0 8 4 0 8Z" className="fill-accent" />
                  </marker>
                </defs>
                <path d="M450 91V105H150V142" className="fill-none stroke-muted" markerEnd="url(#workflow-branch-arrow)" />
                <path d="M450 91V142" className="fill-none stroke-muted" markerEnd="url(#workflow-branch-arrow)" />
                <path d="M450 105H750V142" className="fill-none stroke-accent" markerEnd="url(#workflow-pass-arrow)" />
              </svg>
              <div className="absolute top-1 left-1/2 flex size-16 -translate-x-1/2 rotate-45 items-center justify-center border border-text bg-bg">
                <span className="-rotate-45 text-center text-[0.6875rem] leading-[1.25] font-semibold">
                  Evidence
                  <br />
                  decides
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-5">
              <div className="rounded-xl border border-line bg-bg px-5 py-4">
                <p className="text-[0.6875rem] font-semibold tracking-[0.08em]">FAIL</p>
                <p className="mt-1 text-[0.9375rem] leading-5 font-semibold tracking-[-0.01em]">
                  Ship reproduces and repairs
                </p>
                <p className="mt-1 text-[0.8125rem] leading-5 text-muted">
                  Affected checks return to Verify
                </p>
              </div>
              <div className="rounded-xl border border-line bg-bg px-5 py-4">
                <p className="text-[0.6875rem] font-semibold tracking-[0.08em] text-muted">BLOCKED</p>
                <p className="mt-1 text-[0.9375rem] leading-5 font-semibold tracking-[-0.01em]">
                  No green delivery
                </p>
                <p className="mt-1 text-[0.8125rem] leading-5 text-muted">
                  Missing proof stops the path
                </p>
              </div>
              <div className="rounded-xl border border-accent bg-accent-soft px-5 py-4">
                <p className="text-[0.6875rem] font-semibold tracking-[0.08em] text-accent">PASS</p>
                <p className="mt-1 text-[0.9375rem] leading-5 font-semibold tracking-[-0.01em]">
                  Ship finalizes and delivers
                </p>
                <p className="mt-1 text-[0.8125rem] leading-5 text-text/65">Only when authorized</p>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-line bg-surface p-4 min-[1100px]:hidden">
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
      <Reveal
        as="p"
        className="mt-4 text-sm text-muted min-[760px]:col-span-2 min-[760px]:-mt-6 min-[760px]:max-w-[34rem] min-[760px]:justify-self-end min-[760px]:text-right"
      >
        A version of this workflow, aimed towards software engineering teams can be found{' '}
        <a
          href="https://github.com/solution8-com/agentic-playbook"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline-offset-2 hover:underline"
        >
          here
        </a>
        .
      </Reveal>
    </>
  )
}

export default WorkingMethod
