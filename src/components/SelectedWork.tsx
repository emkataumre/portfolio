import { motion } from 'motion/react'
import Reveal from './Reveal'
import Rule from './Rule'

const entries = [
  {
    title: 'Tasks: turn static data into actionable work.',
    body: 'Any finding in the product becomes a task with an owner, a due date, and a state. Tasks show up on seven grid views and one My Tasks page, and the right people get mail when something changes. Built solo, end to end.',
    scale: '21 000+ lines across 154 files',
    status: 'In final review for the September release.',
  },
  {
    title: 'Dynamic Templates: one definition, many insights.',
    body: 'Create one insight template and generate linked copies for a dataset. Publish changes centrally while each copy keeps its local description and default view.',
    scale: 'Frontend and backend',
    status: '',
  },
  {
    title: 'This website',
    body: 'Planned and built using the same method. Mostly made from my phone :)',
    scale: '2 000+',
    status: '',
  },
]

function SelectedWork() {
  return (
    <div>
      {entries.map(({ title, body, scale, status }, index) => (
        <motion.div
          key={title}
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, amount: 0.4 }}
        >
          <Rule drawIndex={index} />
          <Reveal className="grid gap-6 py-[22px] min-[760px]:grid-cols-[1fr_auto]">
            <div>
              <h3 className="text-base font-semibold tracking-[-0.01em]">{title}</h3>
              <p className="mt-1 text-muted">{body}</p>
            </div>
            <div className="font-mono text-[0.8125rem] min-[760px]:text-right">
              <p className="font-medium">{scale}</p>
              {status && <p className="mt-0.5 text-muted">{status}</p>}
            </div>
          </Reveal>
          {index === entries.length - 1 && <Rule drawIndex={entries.length} />}
        </motion.div>
      ))}
    </div>
  )
}

export default SelectedWork
