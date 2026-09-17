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

const technologies = [
  { name: 'Go', icon: siGo },
  { name: 'React', icon: siReact },
  { name: 'TypeScript', icon: siTypescript },
  { name: 'Python', icon: siPython },
  { name: 'PostgreSQL', icon: siPostgresql },
  { name: 'Git', icon: siGit },
  { name: 'Claude Code', icon: siClaude },
  { name: 'Codex', icon: codexIcon },
] as const satisfies ReadonlyArray<{ name: string; icon: { path: string; hex: string } }>

function TechnologyMark({ icon }: { icon: { path: string; hex: string } }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-8" fill={`#${icon.hex}`}>
      <path d={icon.path} fillRule="evenodd" clipRule="evenodd" />
    </svg>
  )
}

function Technologies() {
  return (
    <Reveal className="mt-16">
      <div className="border-b border-line pb-3">
        <h2 className="text-base font-semibold tracking-[-0.01em]">Technologies</h2>
      </div>
      <ul className="grid grid-cols-2 border-l border-line min-[620px]:grid-cols-4">
        {technologies.map(({ name, icon }) => (
          <li key={name} className="flex min-h-28 flex-col items-center justify-center gap-3 border-r border-b border-line bg-surface px-3 py-5 text-center transition-colors hover:bg-accent-soft">
            <TechnologyMark icon={icon} />
            <span className="font-mono text-[0.75rem] text-muted">{name}</span>
          </li>
        ))}
      </ul>
    </Reveal>
  )
}

export default Technologies
