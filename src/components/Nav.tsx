function Nav() {
  return (
    <nav aria-label="Main" className="flex items-center justify-between text-sm">
      <span>Emil Vladinov</span>
      <div className="flex gap-7">
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
