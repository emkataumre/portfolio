function Nav() {
  return (
    <nav aria-label="Main" className="flex flex-wrap items-center justify-between gap-x-7 gap-y-2 text-sm">
      <span>Emil Vladinov</span>
      <div className="flex flex-wrap gap-x-7 gap-y-2">
        <a href="/#work">Work</a>
        <a href="/#method">Method</a>
        <a href="/build-log/">Build Log</a>
        <a href="#contact" className="text-accent">
          Contact
        </a>
      </div>
    </nav>
  )
}

export default Nav
