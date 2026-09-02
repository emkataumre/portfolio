# Visual direction prototype

Type: prototype
Status: resolved
Blocked by: none

## Question

What does the page look like? Build a static prototype of the single page with placeholder copy where final copy does not exist yet: type scale, spacing, accent colour, light and dark themes, the hero card with a placeholder avatar, and the section layouts. Emil reacts, the ticket records the chosen direction and design tokens. This prototype is the canvas for the copy tickets 01, 04, and 05, so keep it easy to edit.

## Prototype

Branch `prototype/visual-direction`, file `.scratch/portfolio-spec/prototypes/visual-direction-prototype.html`. Open it in a browser. Three variants: A Card, B Editorial, C Dossier. Switch with the bottom bar or `?variant=`. The bar also sets theme and accent. Screenshots are in `prototypes/screenshots/` on the same branch. Emil reacted on 2026-09-02.

## Answer

Variant B, Editorial. Light theme is the design baseline. Dark stays as the system-preference variant from the earlier decision. Accent is green.

Layout:
- Page max width 1040 px, side padding 32 px. Top nav: name left, four links right.
- Split hero: headline and lede left, avatar right at 380 px, radius 28 px. On phones the avatar stacks above the headline at 260 px.
- Now strip: one ruled row under the hero with an accent dot.
- Sections: two columns, a 200 px sticky label rail left with a muted subline, content right. Gap 40 px, section spacing 96 px.
- Working Method: principles in a two-column grid, tool pills, one redacted code excerpt, playbook link.
- Selected Work: ruled rows, title and one line left, size and status right in accent.
- Build Log: ruled rows, mono date left, note right, one link to the full log.
- Footer: name and city left, contact links right.

Tokens:
- Sans: Inter, system fallback. Mono: system monospace.
- Headline: clamp(2.4rem, 5vw, 3.6rem), weight 700, tracking -0.035em, line height 1.02. Lede 1.25rem muted. Section label 1rem weight 600. Body 1rem, line height 1.55. Mono 0.8125rem.
- Light: bg #fafaf9, surface #ffffff, text #18181b, muted #6b6b70, line #e6e6e3, accent #16a34a.
- Dark: bg #0f0f10, surface #17171a, text #ececec, muted #9a9aa2, line #26262b, same accent.
- Radii: avatar 28 px, code block 10 px, pills full.

Headline feedback goes to the Positioning and hero copy ticket: keep the shape of "I ship large features in old codebases with coding agents", and add that agentic coding is Emil's default, not a productivity hack, or that Emil applies software engineering principles to agentic coding.

Prototype: branch `prototype/visual-direction`, variant B is the canvas for the copy tickets.
