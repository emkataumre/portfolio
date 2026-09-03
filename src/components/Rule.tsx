/** A separate element, not a border, so the motion ticket can animate scaleX on it. */
function Rule() {
  return <div aria-hidden="true" className="h-px origin-left bg-line" />
}

export default Rule
