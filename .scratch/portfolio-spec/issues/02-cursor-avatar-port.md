# Cursor Avatar port to React + Framer Motion

Type: research
Status: resolved
Blocked by: none

## Question

How does the Cursor Avatar behave in React + Framer Motion, and what does the component contract look like? Start from `../assets/cursor-avatar-reference.md`. Cover: pointer tracking with useMotionValue and useSpring, Pose selection with thresholds and hysteresis, the in-Pose wobble, image preloading, return to Center, reduced-motion fallback, and two touch options (follow last tap, slow idle drift). Recommend one touch option. Note image format and size for nine Poses. Check current Framer Motion API names against docs.

## Answer

- The Cursor Avatar is a hook plus one square frame. `useMotionValue` holds the normalized pointer vector, `useSpring` smooths it, `useMotionValueEvent` runs Pose selection, and `useTransform` drives the wobble. All names are current in `motion/react`.
- Pose selection uses a dot score against eight unit vectors with a threshold of 0.8, a dead zone of 0.25 for Center, and a hysteresis margin of 0.05 before a swap.
- All nine Poses decode on mount with `Image().decode()`. Render the nine stacked and toggle `visibility`. Preload only Center in the head.
- Return to Center sets the raw target to zero and lets the same spring settle. `useReducedMotion()` true shows the Center Pose static, with `MotionConfig reducedMotion="user"` at the root.
- Touch: slow idle drift is the recommendation, with a tap on the avatar as a bonus. Images: WebP, 560 by 560 px, quality 80, about 300 KB for nine.

Findings: `../research/cursor-avatar-port.md`
