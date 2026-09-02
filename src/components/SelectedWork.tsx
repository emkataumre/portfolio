import { Fragment } from 'react'

const entries = [
  {
    title: 'Tasks: turn an insight into work someone owns.',
    body: 'Any finding in the product becomes a task with an owner, a due date, and a state. Tasks show up on seven grid views and one My Tasks page, and the right people get mail when something changes. Built alone, end to end.',
    meta: ['21k lines · 154 files', 'In final review for the September release'],
  },
  {
    title: 'Mentions: @ a colleague, # a record.',
    body: 'Type @ to bring a colleague into a comment or task, # to link the record it is about. Search ranks the match as you type. One composer serves comments and tasks.',
    meta: ['5k lines', 'In final review'],
  },
  {
    title: 'This site.',
    body: 'Planned and built with the same method, in public. Every decision is in the Build Log.',
    meta: ['Vite, React, Framer Motion', 'Public repo'],
  },
]

/** A separate element, not a border, so the motion ticket can animate scaleX on it. */
function Rule() {
  return <div aria-hidden="true" className="h-px origin-left bg-line" />
}

function SelectedWork() {
  return (
    <div>
      {entries.map(({ title, body, meta }) => (
        <Fragment key={title}>
          <Rule />
          <div className="grid gap-6 py-[22px] min-[760px]:grid-cols-[1fr_auto]">
            <div>
              <h3 className="text-base font-semibold tracking-[-0.01em]">{title}</h3>
              <p className="mt-1 text-muted">{body}</p>
            </div>
            <div className="font-mono text-[0.8125rem] text-muted min-[760px]:text-right">
              <p>{meta[0]}</p>
              <p>{meta[1]}</p>
            </div>
          </div>
        </Fragment>
      ))}
      <Rule />
    </div>
  )
}

export default SelectedWork
