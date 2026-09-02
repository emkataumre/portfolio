# Map: Portfolio spec

Label: wayfinder:map
Created: 2026-09-02
Tracker: local markdown (`.scratch/portfolio-spec/`)

## Destination

A build-ready spec at `.scratch/portfolio-spec/spec.md` for Emil's personal portfolio site: final copy for every section, the visual and motion direction, the Cursor Avatar behaviour, the Build Log mechanism, and the stack and deploy plan. A build session can start from the spec without a new decision.

## Notes

- Domain glossary: `CONTEXT.md` at the repo root. Use its terms: Reader, Cursor Avatar, Pose, Working Method, Testimony, Build Log.
- Skills: `grilling` and `domain-modeling` for grilling tickets. `prototype` for prototype tickets. `research` for research tickets. `ste-writing` for any copy that lands in the spec.
- Reader: an engineering lead or senior peer. A recruiter must get the gist from the top fold.
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

## Not yet specified

- Build Log entry style and the first entries. Depends on the generation mechanism.
- Contact section: which links, how email is shown, spam protection.
- SEO and social: page title, meta description, Open Graph image.
- Final touch behaviour for the avatar: last tap or idle drift. Depends on the avatar research.
- Which redacted artifacts from Emil's setup go on the site, and how redaction is done. Depends on the Working Method ticket.
- How the `.scratch` map appears in the Build Log: raw files or rendered.

## Out of scope

- MCP or agent features inside the site itself. Needs a backend and conflicts with "not overwhelming".
- A second outfit or click toggle on the Cursor Avatar.
- Custom domain, analytics, CV download, skills list, earlier jobs.
- Building the site. That is the next effort, started from the spec.
