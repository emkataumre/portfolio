import type { ReactNode } from 'react'

type SectionProps = {
  id: string
  label: string
  subline: string
  /** Heading element for the label. h2 by default, h1 on the Build Log page. */
  headingLevel?: 'h1' | 'h2'
  children: ReactNode
}

function Section({ id, label, subline, headingLevel = 'h2', children }: SectionProps) {
  const Heading = headingLevel
  return (
    <section id={id} className="mt-24 grid gap-10 min-[760px]:grid-cols-[200px_1fr]">
      <div className="self-start min-[760px]:sticky min-[760px]:top-6">
        <Heading className="text-base font-semibold tracking-[-0.01em]">{label}</Heading>
        <p className="text-base text-muted">{subline}</p>
      </div>
      <div className="text-base leading-[1.55]">{children}</div>
    </section>
  )
}

export default Section
