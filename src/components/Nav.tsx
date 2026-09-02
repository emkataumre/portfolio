type NavProps = {
  /** Prefix for the in-page links. Empty on the home page, "/" on other pages. */
  base?: string
}

function Nav({ base = '' }: NavProps) {
  return (
    <nav aria-label="Main" className="flex items-center justify-between text-sm">
      <span>Emil Vladinov</span>
      <div className="flex gap-7">
        <a href={`${base}#work`}>Work</a>
        <a href={`${base}#method`}>Method</a>
        <a href="/build-log/">Build Log</a>
        <a href={`${base}#contact`} className="text-accent">
          Contact
        </a>
      </div>
    </nav>
  )
}

export default Nav
