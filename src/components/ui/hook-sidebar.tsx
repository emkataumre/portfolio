import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState, type ComponentProps } from 'react'
import { cn } from '@/lib/utils'

// Adapted for Vite and in-page anchors from Rare UI's Hook Sidebar.
const CORNER = 6
const DASH = 'repeating-linear-gradient(to top, transparent 0 2px, currentColor 2px 4px)'

export type HookSidebarItem = string | { label: string; href?: string }

export type HookSidebarProps = Omit<ComponentProps<'nav'>, 'onChange'> & {
  items: HookSidebarItem[]
  label?: string
  value?: number
  defaultValue?: number
  onChange?: (index: number) => void
  color?: string
  dashed?: boolean
}

const hrefOf = (item: HookSidebarItem) => (typeof item === 'string' ? undefined : item.href)
const labelOf = (item: HookSidebarItem) => (typeof item === 'string' ? item : item.label)

function Rail({
  from = 0,
  y,
  visible,
  color,
  dashed,
  className,
}: {
  from?: number
  y: number | null
  visible: boolean
  color?: string
  dashed: boolean
  className?: string
}) {
  const reduced = useReducedMotion()
  const travel = reduced
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 420, damping: 34, mass: 0.7 }

  return (
    <motion.span
      aria-hidden="true"
      initial={false}
      style={{ color }}
      animate={{ opacity: visible && y !== null ? 1 : 0 }}
      transition={reduced ? { duration: 0 } : { duration: 0.2 }}
      className={cn('pointer-events-none absolute inset-0', className)}
    >
      <motion.span
        initial={false}
        animate={{ top: from, height: Math.max(0, (y ?? 0) - CORNER - from) }}
        transition={travel}
        style={dashed ? { backgroundImage: DASH } : { backgroundColor: 'currentColor' }}
        className="absolute left-0.5 w-px"
      />
      <motion.svg
        initial={false}
        animate={{ top: (y ?? 0) - CORNER }}
        transition={travel}
        width="12"
        height="7"
        viewBox="0 0 12 7"
        fill="none"
        className="absolute left-0.5"
      >
        <path
          d="M0.5 0a6 6 0 0 0 6 6H12"
          stroke="currentColor"
          strokeDasharray={dashed ? '2 2' : undefined}
        />
      </motion.svg>
    </motion.span>
  )
}

export function HookSidebar({
  items,
  label,
  value,
  defaultValue = 0,
  onChange,
  color = 'var(--color-accent)',
  dashed = true,
  className,
  ...props
}: HookSidebarProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLElement | null)[]>([])
  const [centers, setCenters] = useState<number[]>([])
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [pointerInside, setPointerInside] = useState(false)
  const [focusInside, setFocusInside] = useState(false)
  const activeIndex = value ?? internalValue

  useEffect(() => {
    const list = listRef.current
    if (!list) return

    const measure = () =>
      setCenters(itemRefs.current.map((item) => (item ? item.offsetTop + item.offsetHeight / 2 : 0)))

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    return () => observer.disconnect()
  }, [items.length])

  const activeY = centers[activeIndex] ?? null
  const hoverY = hoverIndex === null ? null : (centers[hoverIndex] ?? null)
  const hoverFrom =
    activeY !== null && hoverY !== null && hoverY <= activeY
      ? Math.max(0, hoverY - CORNER)
      : (activeY ?? 0)

  const select = (index: number) => {
    if (value === undefined) setInternalValue(index)
    onChange?.(index)
  }

  return (
    <nav
      data-slot="hook-sidebar"
      aria-label={label ?? 'Main'}
      className={cn('flex flex-col', className)}
      {...props}
    >
      {label && (
        <span className="pb-3 pl-0.5 pr-2 text-sm font-medium tracking-[-0.01em] text-text">
          {label}
        </span>
      )}
      <div
        ref={listRef}
        onMouseLeave={() => setPointerInside(false)}
        className="relative flex flex-col gap-0.5"
      >
        <Rail
          from={hoverFrom}
          y={hoverY}
          visible={(pointerInside || focusInside) && hoverIndex !== activeIndex}
          dashed={dashed}
          className="text-muted/35"
        />
        <Rail y={activeY} visible={activeY !== null} color={color} dashed={dashed} />
        {items.map((item, index) => {
          const label = labelOf(item)
          const href = hrefOf(item)
          const isActive = index === activeIndex
          const rowProps = {
            'data-slot': 'hook-sidebar-item',
            'data-active': isActive,
            onMouseEnter: () => {
              setHoverIndex(index)
              setPointerInside(true)
            },
            onFocus: () => {
              setHoverIndex(index)
              setFocusInside(true)
            },
            onBlur: () => setFocusInside(false),
            onClick: () => select(index),
            className: cn(
              'rounded-lg py-1.5 pr-2 pl-5 text-left text-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none',
              isActive ? 'text-text' : 'text-muted hover:text-text',
            ),
          }

          return href ? (
            <a
              key={`${index}-${label}`}
              {...rowProps}
              ref={(element) => {
                itemRefs.current[index] = element
              }}
              href={href}
              aria-current={isActive ? 'location' : undefined}
            >
              {label}
            </a>
          ) : (
            <button
              key={`${index}-${label}`}
              {...rowProps}
              ref={(element) => {
                itemRefs.current[index] = element
              }}
              type="button"
              aria-current={isActive ? 'true' : undefined}
            >
              {label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
