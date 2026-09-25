import {
  siClaude,
  siGit,
  siGo,
  siPostgresql,
  siPython,
  siReact,
  siTypescript,
} from 'simple-icons'
import Reveal from './Reveal'

const codexIcon = {
  title: 'Codex',
  slug: 'codex',
  hex: '18181B',
  source: 'https://icons.lobehub.com/',
  path: 'M8.086.457a6.105 6.105 0 013.046-.415c1.333.153 2.521.72 3.564 1.7a.117.117 0 00.107.029c1.408-.346 2.762-.224 4.061.366l.063.03.154.076c1.357.703 2.33 1.77 2.918 3.198.278.679.418 1.388.421 2.126a5.655 5.655 0 01-.18 1.631.167.167 0 00.04.155 5.982 5.982 0 011.578 2.891c.385 1.901-.01 3.615-1.183 5.14l-.182.22a6.063 6.063 0 01-2.934 1.851.162.162 0 00-.108.102c-.255.736-.511 1.364-.987 1.992-1.199 1.582-2.962 2.462-4.948 2.451-1.583-.008-2.986-.587-4.21-1.736a.145.145 0 00-.14-.032c-.518.167-1.04.191-1.604.185a5.924 5.924 0 01-2.595-.622 6.058 6.058 0 01-2.146-1.781c-.203-.269-.404-.522-.551-.821a7.74 7.74 0 01-.495-1.283 6.11 6.11 0 01-.017-3.064.166.166 0 00.008-.074.115.115 0 00-.037-.064 5.958 5.958 0 01-1.38-2.202 5.196 5.196 0 01-.333-1.589 6.915 6.915 0 01.188-2.132c.45-1.484 1.309-2.648 2.577-3.493.282-.188.55-.334.802-.438.286-.12.573-.22.861-.304a.129.129 0 00.087-.087A6.016 6.016 0 015.635 2.31C6.315 1.464 7.132.846 8.086.457zm-.804 7.85a.848.848 0 00-1.473.842l1.694 2.965-1.688 2.848a.849.849 0 001.46.864l1.94-3.272a.849.849 0 00.007-.854l-1.94-3.393zm5.446 6.24a.849.849 0 000 1.695h4.848a.849.849 0 000-1.696h-4.848z',
}

const stack = [
  { name: 'Go', icon: siGo },
  { name: 'React', icon: siReact },
  { name: 'TypeScript', icon: siTypescript },
  { name: 'Python', icon: siPython },
  { name: 'PostgreSQL', icon: siPostgresql },
  { name: 'Git', icon: siGit },
] as const satisfies ReadonlyArray<{ name: string; icon: { path: string; hex: string } }>

const agents = [
  { name: 'Claude Code', icon: siClaude, color: `#${siClaude.hex}` },
  { name: 'Codex', icon: codexIcon, color: '#f3f5f2' },
] as const

function TechnologyMark({ path, color, className }: { path: string; color: string; className: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill={color}>
      <path d={path} fillRule="evenodd" clipRule="evenodd" />
    </svg>
  )
}

function Technologies() {
  return (
    <div className="grid gap-3">
      <Reveal>
        <ul className="dark-band grid gap-px overflow-hidden rounded-[20px] bg-line min-[520px]:grid-cols-2">
          {agents.map(({ name, icon, color }) => (
            <li key={name} className="flex items-center gap-5 bg-surface px-6 py-7">
              <TechnologyMark path={icon.path} color={color} className="size-11 shrink-0" />
              <div>
                <p className="text-xl font-semibold tracking-[-0.02em] text-text">{name}</p>
                <p className="mt-1 font-mono text-[0.6875rem] tracking-[0.08em] text-muted uppercase">
                  Coding agent
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal>
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-[20px] border border-line bg-line min-[620px]:grid-cols-3">
          {stack.map(({ name, icon }) => (
            <li
              key={name}
              className="group flex items-center gap-4 bg-surface px-5 py-5 transition-colors hover:bg-bg"
            >
              <TechnologyMark
                path={icon.path}
                color={`#${icon.hex}`}
                className="size-7 shrink-0 opacity-45 grayscale transition-[filter,opacity] duration-300 group-hover:opacity-100 group-hover:grayscale-0"
              />
              <span className="text-[0.9375rem] font-medium tracking-[-0.01em]">{name}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  )
}

export default Technologies
