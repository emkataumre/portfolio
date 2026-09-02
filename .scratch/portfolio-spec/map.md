# Map: Portfolio spec

Label: wayfinder:map
Created: 2026-09-02
Tracker: GitHub issues, map is https://github.com/emkataumre/portfolio/issues/1. This file and `issues/` are the archive of the charting session. Status, claims, and blocking live on GitHub.

## Destination

A build-ready spec at `.scratch/portfolio-spec/spec.md` for Emil's personal portfolio site: final copy for every section, the visual and motion direction, the Cursor Avatar behaviour, the Build Log mechanism, and the stack and deploy plan. A build session can start from the spec without a new decision.

## Notes

- Domain glossary: `CONTEXT.md` at the repo root. Use its terms: Reader, Cursor Avatar, Pose, Working Method, Testimony, Build Log.
- Skills: `grilling` and `domain-modeling` for grilling tickets. `prototype` for prototype tickets. `research` for research tickets. `ste-writing` for any copy that lands in the spec.
- Reader: an engineering lead or senior peer. A recruiter must get the gist from the top fold.
- Prototype as you go. Every ticket that decides something visible produces a rough visual to react to before the decision is recorded. Emil does not decide visuals from text. Copy tickets are worked inside the visual prototype, not before it.
- Tone rule: state Testimony plainly. Never dress a private claim up as proof. The Build Log is the only verifiable artifact.
- Reference assets: `assets/cursor-avatar-reference.md` (the Framer demo and its prompt), `assets/inact-scan.md` (what Inact is and what Emil delivered there). The scan is raw material, not copy.
- This map and its tickets are public. They ship in the site repo as part of the Build Log. Keep customer names, colleague names, secrets, and internal issue numbers out.

## Decisions so far

- Destination is a build-ready spec, not a live site. Execution is a later effort.
- Reader is an engineering lead, with a recruiter-friendly top fold.
- Single page with six sections in this order: hero with Cursor Avatar, Now strip (Inact role, Solution 8 mention), Working Method, Selected Work, Build Log teaser, Contact. The Build Log has its own route. No skills list, no earlier jobs, no CV download.
- The spine of the Working Method is: Emil introduced agentic coding alone at Inact, and saw the team version at Solution 8. Solution 8 is a supporting point, not a resume entry.
- The Working Method names real tools (Claude Code, skills, MCPs, wayfinder and grilling flow) and shows one or two redacted artifacts from Emil's setup. It links the Solution 8 agentic playbook: https://github.com/solution8-com/agentic-playbook
- Inact disclosure: name the company and product, describe domain, stack, and sizes. No client names. Describe the Tasks epic as "in final review for the September release", not as shipped.
- Cursor Avatar is the hero centrepiece. Real photos, nine Poses, one outfit. Ported to React + Framer Motion.
- Visual direction: light, minimal, one accent colour, system-preference dark theme. Restrained motion: entrance reveals, the avatar, a few scroll-linked moments.
- Stack: Vite, React, TypeScript, Framer Motion, Tailwind. Deploy to Cloudflare Pages on the free subdomain. No owned domain for v1.
- Build tooling: Framer Motion and the Playwright MCP as the baseline. Add one more tool only when a ticket needs it.
- Build Log is generated from the site repo's git history with short human annotations. The repo is public on GitHub. Git history starts today, with this planning.
- Reduced motion is honoured: the avatar goes static, reveals become fades. Touch devices: the avatar follows the last tap or drifts slowly between Poses.
- English only. No analytics.
- [Cursor Avatar port to React + Framer Motion](issues/02-cursor-avatar-port.md): a hook plus one square frame in `motion/react`. Dot-score Pose selection with threshold, dead zone, and hysteresis. Nine stacked WebP images at 560 px. Research recommends idle drift on touch.
- [Build Log generation from git history](issues/06-build-log-generation.md): a prebuild script turns `git log` into JSON, human notes live in one markdown file keyed by day, and the build never fails when history is missing.
- [Stack scaffold and Cloudflare Pages deploy](issues/07-stack-scaffold-and-deploy.md): Vite 8, React 19, TypeScript 6, Tailwind 4 through the Vite plugin, `motion` 13. Cloudflare Pages by Git with the React (Vite) preset. `MotionConfig reducedMotion="user"` at the root.
- [Visual direction prototype](issues/08-visual-direction-prototype.md): variant B, Editorial. Light baseline, green accent, split hero with a 380 px avatar, sticky label rail sections, ruled rows. Tokens are on the ticket. Prototype on branch `prototype/visual-direction`.

## Not yet specified

- Build Log details: day-grouping timezone (proposal Europe/Sofia), whether merge commits appear (proposal no), and the first entries and their annotation style.
- Build Log route: the two research results disagree. One recommends a second HTML entry in the Vite multi-page build, the other a pathname switch with the automatic SPA fallback. Pick one in the spec.
- Small stack picks: TypeScript 6 template pin or 7, and a project-scope `.mcp.json` for Playwright or the user-scope config.
- Contact section: which links, how email is shown, spam protection.
- SEO and social: page title, meta description, Open Graph image.
- Which redacted artifacts from Emil's setup go on the site, and how redaction is done. Depends on the Working Method ticket.
- How the `.scratch` map appears in the Build Log: raw files or rendered.

## Out of scope

- MCP or agent features inside the site itself. Needs a backend and conflicts with "not overwhelming".
- A second outfit or click toggle on the Cursor Avatar.
- Custom domain, analytics, CV download, skills list, earlier jobs.
- Building the site. That is the next effort, started from the spec.
