# Stack scaffold and Cloudflare Pages deploy

Type: research
Status: resolved
Blocked by: none

## Question

What are the current setup steps and gotchas for Vite + React + TypeScript + Tailwind + Framer Motion, deployed to Cloudflare Pages on the free subdomain? Cover current major versions, Tailwind setup for the current version, prefers-reduced-motion support in Framer Motion, a second route for the Build Log without a heavy router, and the Playwright MCP for visual checks in the build loop. Output a scaffold checklist.

## Answer

Use Vite 8, React 19, TypeScript 6 (the template pin), Tailwind 4 through `@tailwindcss/vite` with no PostCSS config, and `motion` 13 imported from `motion/react`.
Deploy on Cloudflare Pages by Git: preset React (Vite), build `npm run build`, output `dist`, Node pinned with `.nvmrc`. The SPA fallback is automatic when no `404.html` exists, so `/build-log` needs no `_redirects`.
Reduced motion: wrap the tree in `<MotionConfig reducedMotion="user">` so reveals become fades, and use `useReducedMotion()` in the Cursor Avatar to render a static Pose.
Second route: a `window.location.pathname` switch for v1, or `wouter` (about 2.2 KB) if entries need deep links.
Playwright MCP is already in the user scope with `--image-responses omit`, so every screenshot needs a `filename` and a Read. Loop: resize 1280x800, navigate, snapshot, screenshot, resize 390x844, screenshot, check console errors.

Findings: [research/stack-scaffold-and-deploy.md](../research/stack-scaffold-and-deploy.md)
