import { motion } from 'motion/react'
import Reveal from './Reveal'
import Rule from './Rule'

const entries = [
  {
    title: 'Tasks: turn static data into actionable work.',
    body: 'Any finding in the product becomes a task with an owner, a due date, and a state. Tasks show up on seven grid views and one My Tasks page, and the right people get mail when something changes. Built solo, end to end.',
    scale: '21 000+',
    detail: 'lines across 154 files',
    status: 'In final review for the September release.',
  },
  {
    title: 'Dynamic Templates: one definition, many insights.',
    body: 'Clients repeatedly asked for a way to create one insight template, generate linked copies for a dataset, and publish updates centrally. Each copy keeps its local description and default view.',
    scale: '14 000+',
    detail: 'lines across 91 files',
    status: '',
  },
  {
    title: 'This website',
    body: 'Planned and built using the same method. Mostly made from my phone :)',
    scale: '3 300+',
    detail: 'lines across 33 files',
    status: '',
  },
]

function SelectedWork() {
  return (
    <div>
      {entries.map(({ title, body, scale, detail, status }, index) => (
        <motion.div
          key={title}
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, amount: 0.4 }}
        >
          <Rule drawIndex={index} />
          <Reveal className="group grid gap-4 py-8 min-[760px]:grid-cols-[1fr_auto] min-[760px]:gap-8">
            <div>
              <p className="font-mono text-[0.6875rem] tracking-[0.08em] text-accent">
                0{index + 1}
              </p>
              <h3 className="mt-2 text-lg leading-snug font-semibold tracking-[-0.02em]">{title}</h3>
              <p className="mt-2 text-muted">{body}</p>
            </div>
            <div className="min-[760px]:text-right">
              <p className="text-[clamp(2.5rem,5vw,3.5rem)] leading-none font-bold tracking-[-0.045em] tabular-nums transition-colors group-hover:text-accent">
                {scale}
              </p>
              <p className="mt-2 font-mono text-[0.75rem] text-muted">{detail}</p>
              {status && (
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 font-mono text-[0.6875rem] text-[#15783a]">
                  <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
                  {status}
                </p>
              )}
            </div>
          </Reveal>
          {index === entries.length - 1 && <Rule drawIndex={entries.length} />}
        </motion.div>
      ))}
    </div>
  )
}

export default SelectedWork
