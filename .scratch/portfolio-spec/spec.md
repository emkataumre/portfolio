# Portfolio spec

Status: final, 2026-09-02. Confirmed build-ready by Emil. Assembled from the wayfinder map, [issue #1](https://github.com/emkataumre/portfolio/issues/1).

This spec is the hand-off to the build effort. A build session starts from this file and makes no new product decision. Where a detail is not here, the resolved ticket linked in each section holds it.

Glossary: `CONTEXT.md` at the repo root. Terms: Reader, Cursor Avatar, Pose, Working Method, Testimony, Build Log.

## 1. Scope

- One public page plus one Build Log route. Two activity grids and a counter row on the home page, fed by a scheduled job on Emil's machine (section 11).
- Reader: an engineering lead or senior peer. A recruiter gets the gist from the headline and lede alone.
- English only. No analytics. No dark theme. No custom domain. No CV download, skills list, or earlier jobs.
- Tone: state Testimony plainly. The Build Log is the only verifiable artifact.
- Public repo. No customer names, colleague names, secrets, or internal issue numbers anywhere in the repo.

Out of scope for the build: the Working Method video (the build ships the placeholder slot), MCP or agent features in the site, a second avatar outfit.

## 2. Page structure

Single page, in this order. Source: [Visual direction prototype](https://github.com/emkataumre/portfolio/issues/9).

1. Nav: name left, four links right. Work, Method, Build Log, Contact. Contact is the accent link.
2. Hero: headline and lede left, Cursor Avatar right.
3. Now strip: two ruled rows.
4. Working Method.
5. Selected Work.
6. Build Log teaser, with one link to `/build-log/`, and under it the Activity block: two grids and a counter row.
7. Footer with contact links.

Sections 4 to 6 use the two-column layout: a 200 px sticky label rail left (label plus muted subline), content right. Gap 40 px, section spacing 96 px.

Under 760 px: one column, the avatar stacks above the headline at 220 px, the label rail becomes a normal heading.

## 3. Copy

All copy is final. Do not reword it in the build. Source tickets: [Positioning and hero copy](https://github.com/emkataumre/portfolio/issues/2), [Working Method content](https://github.com/emkataumre/portfolio/issues/5), [Selected Work entries](https://github.com/emkataumre/portfolio/issues/6).

### 3.1 Nav

`Emil Vladinov` left. Links: Work, Method, Build Log, Contact.

### 3.2 Hero

Headline:

> Real software, built with AI agents.

Lede:

> The agents write the code. The engineering does not change: small steps, tests, review, and runtime verification. I own the result. Software engineer in Copenhagen.

### 3.3 Now strip

Two rows. Each row: accent dot, label column 92 px, text.

- **Now**: Software engineer at Inact. I use agentic coding to land large features fast in a large legacy codebase.
- **In parallel**: At Solution 8 I work in a team that runs on agentic workflows: shared skills, shared conventions, agent-written code reviewed by peers. We build internal tools and open source material on agentic programming.

### 3.4 Working Method

Label: **Working Method**. Subline: **How agent code gets to main**.

Testimony line, muted, above the principles:

> At Inact, this method has put about 21k lines of agent-written code through senior review.

Five principles in a two-column grid. The fifth card spans both columns.

- **Plan first.** Every feature starts as a map of decisions. No code until the questions have answers.
- **Argue the plan.** The agent interrogates the plan before it builds. Weak ideas die on paper.
- **Small steps with tests.** One change at a time. A failing test first, where the codebase allows it.
- **Review in passes.** Security, dead code, duplication, error handling. Each pass runs in a fresh context.
- **Verify at runtime.** The agent drives the app and queries the database before it says "done".

Video slot, 16:9, radius 10 px, 1 px line border, muted surface, centred accent play disc. Caption in mono, bottom left: `One feature, from map to production. 40 s, with music.` The slot is a placeholder in v1. When the video exists: muted by default, loops, plays when in view, poster frame and a play control under reduced motion.

No tools line. No pills. Closing line with the one accent link:

> The team version of this method is public: [the Solution 8 agentic playbook](https://github.com/solution8-com/agentic-playbook).

### 3.5 Selected Work

Label: **Selected Work**. Subline: **Inact, 2026. A legacy Go and React monorepo, 415k lines.**

Three ruled entries. Each: title, one outcome paragraph left, meta column right (muted, mono size, right aligned).

1. **Tasks: turn an insight into work someone owns.** Any finding in the product becomes a task with an owner, a due date, and a state. Tasks show up on seven grid views and one My Tasks page, and the right people get mail when something changes. Built alone, end to end. Meta: `21k lines · 154 files` / `In final review for the September release`.
2. **Mentions: @ a colleague, # a record.** Type @ to bring a colleague into a comment or task, # to link the record it is about. Search ranks the match as you type. One composer serves comments and tasks. Meta: `5k lines` / `In final review`.
3. **This site.** Planned and built with the same method, in public. Every decision is in the Build Log. Meta: `Vite, React, Framer Motion` / `Public repo`.

### 3.6 Build Log teaser

Label: **Build Log**. Subline: **The one thing you can verify**.

Ruled rows: mono date left (110 px column), the day note right. Show the three most recent days that have a note. Below: accent link `Read the full Build Log →` to `/build-log/`.

Under the link, inside the same section: the Activity block from section 11.

### 3.7 Footer

Left: `Emil Vladinov · Copenhagen`. Right: the contact links from section 10.

## 4. Design tokens

Source: [Visual direction prototype](https://github.com/emkataumre/portfolio/issues/9). Put them in `src/index.css` under Tailwind's `@theme`.

| Token | Value |
|---|---|
| Sans | Inter, then ui-sans-serif, system-ui, Segoe UI, Roboto |
| Mono | ui-monospace, JetBrains Mono, SF Mono, Menlo, Consolas |
| bg | `#fafaf9` |
| surface | `#ffffff` |
| text | `#18181b` |
| muted | `#6b6b70` |
| line | `#e6e6e3` |
| accent | `#16a34a` |
| accent-soft | `color-mix(in oklab, accent 12%, transparent)` |

Type:

| Role | Size | Weight | Other |
|---|---|---|---|
| Headline | `clamp(2.4rem, 5vw, 3.6rem)` | 700 | tracking -0.035em, line height 1.02 |
| Lede | 1.25rem | 400 | muted, line height 1.45, max width 520 px |
| Section label | 1rem | 600 | tracking -0.01em, sticky at top 24 px |
| Section subline | 1rem | 400 | muted |
| Body | 1rem | 400 | line height 1.55 |
| Now strip | 0.95rem | 400 | line height 1.5 |
| Nav, footer | 0.875rem | 400 | footer muted |
| Meta, mono | 0.8125rem | 400 | muted |

Layout: page max width 1040 px, side padding 32 px, top padding 48 px. Hero grid `1.3fr 1fr`, gap 56 px, top margin 88 px. Now strip top margin 72 px. Footer top margin 120 px. Rules are 1 px `line`. Radii: avatar 28 px, video slot 10 px.

Inter loads from a self-hosted WOFF2 in `public/fonts/` with `font-display: swap`. No third-party font request.

## 5. Motion

Source: [Motion choreography prototype](https://github.com/emkataumre/portfolio/issues/10). Variant B, Editorial. Easing everywhere `cubic-bezier(0.22, 1, 0.36, 1)`. Reveals run once.

| Moment | What moves | Trigger | Duration |
|---|---|---|---|
| Nav | opacity 0 to 1 | mount | 0.5 s |
| Hero | headline, lede, avatar, Now strip: opacity 0 to 1, y 12 px to 0 | mount, 0.1 s after nav, 80 ms stagger in that order | 0.6 s each |
| Below the fold | each block (testimony, each principle, video slot, playbook line, each work entry, each log row, footer): opacity 0 to 1, y 12 px to 0 | 15% in view, 40 px bottom margin, one element at a time | 0.5 s |
| Scroll 1: avatar recedes | avatar wrapper y 0 to 40 px, scale 1 to 0.94, opacity 1 to 0.5 | scroll-linked from hero bottom at viewport bottom to hero bottom at viewport top | linked |
| Scroll 2: rules draw | top rule of each Selected Work entry and bottom rule of the last: scaleX 0 to 1 from the left | entry 40% in view, 80 ms stagger by index | 0.7 s |

Implementation: `motion/react`. Reveals use `whileInView` with `viewport={{ once: true, amount: 0.15, margin: "0px 0px -40px 0px" }}`. Scroll 1 uses `useScroll` with a target ref and `useTransform`.

Reduced motion: `<MotionConfig reducedMotion="user">` at the root turns reveals into fades. `useReducedMotion()` turns off scroll 1, scroll 2, and the Cursor Avatar motion.

## 6. Cursor Avatar

Source: [Cursor Avatar port](https://github.com/emkataumre/portfolio/issues/3), [Pose photo shoot](https://github.com/emkataumre/portfolio/issues/4), [Motion choreography prototype](https://github.com/emkataumre/portfolio/issues/10).

### 6.1 Assets

Nine WebP files, 370 by 370 px, quality 80, about 125 KB in total. Source of truth: `.scratch/portfolio-spec/assets/poses/pose-<name>.webp`. Names: `center`, `up`, `down`, `left`, `right`, `up-left`, `up-right`, `down-left`, `down-right`. The build copies them to `public/avatar/`. No larger source exists. No re-export.

Preload only `pose-center.webp` in the head with `fetchpriority="high"`. Decode all nine on mount with `Image().decode()` before tracking starts.

### 6.2 Component contract

One component, `CursorAvatar`, no props in v1. One hook, `usePoseVector`, that returns the smoothed vector and the active Pose. Frame 280 px square on desktop, 220 px under 760 px, radius 28 px, `aria-label="Emil Vladinov"`. Render the nine images stacked. The active one has `visibility: visible`, the rest `hidden`. The Center image carries `alt="Pixelated portrait of Emil Vladinov"`, the others `alt=""`.

### 6.3 Tracking

- Input: `pointermove` on `window`. Vector = (pointer minus avatar centre) divided by (half viewport width, half viewport height), times strength 1.6, clamped to [-1, 1]. The screen edge is a full turn. No radius cutoff.
- Return to Center: `pointerleave` on the document element and `blur` on the window set the target to zero.
- `useMotionValue` holds the raw target for x and y. `useSpring` smooths each with stiffness 120, damping 20.
- Pose selection in `useMotionValueEvent` on the smoothed values: dot score against the eight unit vectors. Threshold 0.8, dead zone 0.25 for Center, hysteresis 0.05 before a swap.
- Wobble on the smoothed vector through `useTransform`: translate 2 px, rotate 1 deg, scale 1 to 1.01.

### 6.4 Hover pixel overlay

Changed on 2026-09-03 from a permanent filter to a hover effect. Source: [Cursor Avatar: hover pixel overlay](https://github.com/emkataumre/portfolio/issues/19).

Off hover the Reader sees the active Pose behind a full-colour pixel filter with 2 px cells. While the pointer hovers the frame, a two-colour pixel version of the active Pose fades in over it and flickers. On leave it fades out.

- Pixel filter: one `canvas` above the nine images, `image-rendering: pixelated`, `aria-hidden`. Cells of 2 px, 140 by 140 at 280 px, 110 by 110 at 220 px. Redraw on Pose change and on resize. Always on. Emil brought the filter back at 2 px on 2026-09-03 after seeing the hover overlay alone.

- One overlay `canvas` above the nine images, `pointer-events: none`, `image-rendering: pixelated`, `aria-hidden`.
- Grid: 28 by 28 cells at 280 px, 22 by 22 at 220 px. Square cells of 10 px.
- Two colours, luminance threshold 128, no dithering: `accent` for dark cells, `bg` for light cells.
- Draw on `pointerenter`, on Pose change while hovered, and on resize. Flicker: redraw every 300 ms with a random 0 to 3 px source offset.
- Fade 0.4 s with the site easing.
- Coarse pointer: no overlay.

The OG image and the favicon keep the pixel look as a brand mark. The Center alt text stays "Pixelated portrait of Emil Vladinov". Decided 2026-09-03.

### 6.5 Touch

On a coarse primary pointer (`(pointer: coarse)`): idle drift. Every 2.5 to 4 s move to a neighbouring Pose at magnitude 0.9. Return to Center every third move. Pause when the hero is under 20% in view or the tab is hidden. A tap on the avatar points it at the tap and pauses drift for 4 s. No page-wide tap listener.

### 6.6 Reduced motion

Static Center Pose, no wobble, no drift, no tracking. The hover overlay switches on and off instantly, with no fade and no flicker.

## 7. Build Log

Source: [Build Log generation](https://github.com/emkataumre/portfolio/issues/7), research at `.scratch/portfolio-spec/research/build-log-generation.md`.

### 7.1 Mechanism

- `scripts/build-log.mjs` runs as the npm `prebuild` script. It reads `git log --no-merges --invert-grep --grep='^activity: '` and writes `src/build-log/build-log.json`. The JSON file is in `.gitignore`. The grep filter drops the activity job commits from section 11.
- On Cloudflare the clone is shallow. The script runs `git rev-parse --is-shallow-repository` and, when it prints `true`, `git fetch --unshallow`. It continues on error.
- Day grouping: the author date converted to `Europe/Copenhagen`, keyed `YYYY-MM-DD`.
- Human notes live in `build-log/annotations.md`. One `## YYYY-MM-DD` heading per day, the note as the body. Two to four sentences. STE-flavoured. Days with a note but no commits still render.
- The script never fails the build. With no usable history it writes `source: "fallback"` and the page shows notes only, plus the line "Commit history was not available at build time. See the repository on GitHub." with a link.
- The script prints one line: `build-log: source=git commits=<n>` or `build-log: source=fallback reason=<text>`.
- The script reads no `CF_PAGES_*` variable except `CF_PAGES_COMMIT_SHA` as a fallback for `headSha`.

Data shape:

```ts
type BuildLogCommit = { sha: string; shortSha: string; date: string; subject: string; body: string; filesChanged: number };
type BuildLogDay = { day: string; note: string | null; commits: BuildLogCommit[] };
type BuildLog = { generatedAt: string; source: "git" | "fallback"; repoUrl: string; headSha: string | null; days: BuildLogDay[] };
```

Days and commits are newest first.

### 7.2 Route

`/build-log` is a second HTML entry in the Vite multi-page build: `build-log/index.html` with its own React root, listed in `rollupOptions.input`. Cloudflare Pages serves `dist/build-log/index.html` for `/build-log/` and redirects `/build-log` to it with a 307. All links use `/build-log/`. No router library. Links between the pages are plain `<a href>`. The page has its own title and meta description (section 9).

### 7.3 Build Log page

Same nav and footer as the home page. Label: **Build Log**. Subline: **How this site was built, day by day.** One block per day: mono date, the note, then the commits of that day as ruled rows with short SHA (mono, a link to the commit on GitHub), subject, and files changed. A day with no note shows the commits alone.

The planning files under `.scratch/portfolio-spec/` appear as GitHub links only. The Build Log page has one line above the days: "Planning lives in the repo: the map, its tickets, research notes, and prototypes." with a link to `.scratch/portfolio-spec/` on GitHub. No rendering of markdown in the site.

### 7.4 First entries

`build-log/annotations.md` starts with the planning day:

```md
# Build Log annotations

## 2026-09-02

Planning day. Charted the map, worked ten tickets, and wrote this spec. Three research notes, two prototypes, nine Pose images. No site code yet.
```

The build effort adds one note per working day.

## 8. Stack and deploy

Source: [Stack scaffold and deploy](https://github.com/emkataumre/portfolio/issues/8), research at `.scratch/portfolio-spec/research/stack-scaffold-and-deploy.md`.

Versions: Vite 8, `@vitejs/plugin-react` 6, React 19, TypeScript 6 (the template pin `~6.0.2`, not 7), Tailwind 4 through `@tailwindcss/vite`, `motion` 13 imported from `motion/react`. No `framer-motion` package. No PostCSS config. No `tailwind.config.js`.

Scaffold checklist, in order:

1. `node -v` is 20.19+ or 22.12+.
2. `npm create vite@latest portfolio -- --template react-ts` at the repo root, then move the generated files up so `package.json` sits at the root next to `.scratch/`.
3. `npm install tailwindcss @tailwindcss/vite motion`.
4. `vite.config.ts`: plugins `react()` and `tailwindcss()`, plus `build.rollupOptions.input` with `index.html` and `build-log/index.html`.
5. `src/index.css`: `@import "tailwindcss";` plus the `@theme` tokens from section 4. Delete `App.css`.
6. `.nvmrc` with `22`.
7. `scripts/build-log.mjs` and the `prebuild` script. `build` stays `tsc -b && vite build`.
8. `<MotionConfig reducedMotion="user">` around the root of both pages.
9. Copy the nine Poses to `public/avatar/`.
10. `.gitignore`: add `src/build-log/build-log.json` and `.scratch/shots/`.
11. `npm run build`, then `npm run preview`. Both pages load. Console has no errors.
12. Do not add `public/404.html`.

Cloudflare Pages: connect the GitHub repo, production branch `main`, preset React (Vite), build command `npm run build`, output `dist`, root directory empty. Every push to `main` deploys. Pull requests get preview URLs. Free `*.pages.dev` subdomain.

Playwright MCP: use the user-scope server. Do not add `.mcp.json` to the repo. Every screenshot needs a `filename` under `.scratch/shots/` and a Read. Check loop per change: resize 1280x800, navigate, snapshot, screenshot, resize 390x844, screenshot, then the same for `/build-log/`, then console errors must be empty. Reduced motion check through `page.emulateMedia({ reducedMotion: "reduce" })`.

## 9. Head, SEO, and social

Research: `.scratch/portfolio-spec/research/seo-and-social.md`. Google renders JavaScript, so the static head plus the React-rendered body is enough for two pages. No prerender step. Social scrapers read only the static HTML, so every tag below sits in `index.html` and `build-log/index.html`, never in React.

### 9.1 Site URL

The production URL is `https://<project>.pages.dev/`. The build effort replaces `<project>` with the Pages project name in five places. The places are `SITE_URL` in `src/site.ts`, both HTML entries, `public/robots.txt`, and `public/sitemap.xml`. `CF_PAGES_URL` is the deployment URL, not the production URL, so the build does not read it.

URL paths: `/` and `/build-log/`. Cloudflare Pages answers `/build-log` with a 307 to `/build-log/`, so every internal link, canonical, and sitemap entry uses the slash form.

A custom domain is out of scope. When one comes, the move is one constant change, a Cloudflare Bulk Redirect from `*.pages.dev` to the domain, and Change of Address in Search Console.

### 9.2 Titles and descriptions

Google sets no character limit and truncates to the device width. The target here is 60 characters for a title and 155 for a description.

| Page | `<title>` | Meta description |
|---|---|---|
| Home | `Real software, built with AI agents · Emil Vladinov` (51) | `Software engineer in Copenhagen. I ship real software with AI coding agents such as Claude Code. Small steps, tests, review, runtime verification.` (146) |
| Build Log | `Build Log: how this site was built · Emil Vladinov` (50) | `How this site was built with AI agents, day by day. Notes and commits from the git history of an agentic coding project driven with Claude Code.` (144) |

The home title keeps the headline and puts the name last. "Copenhagen" and "Claude Code" sit in the descriptions, not in the copy. No `meta keywords`. Google ignores it.

### 9.3 Head of the home page

```html
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Real software, built with AI agents · Emil Vladinov</title>
<meta name="description" content="Software engineer in Copenhagen. I ship real software with AI coding agents such as Claude Code. Small steps, tests, review, runtime verification.">
<link rel="canonical" href="https://<project>.pages.dev/">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preload" as="image" href="/avatar/pose-center.webp" fetchpriority="high">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Emil Vladinov">
<meta property="og:url" content="https://<project>.pages.dev/">
<meta property="og:title" content="Real software, built with AI agents · Emil Vladinov">
<meta property="og:description" content="Software engineer in Copenhagen. I ship real software with AI coding agents such as Claude Code. Small steps, tests, review, runtime verification.">
<meta property="og:image" content="https://<project>.pages.dev/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Real software, built with AI agents. A pixelated portrait of Emil Vladinov beside the headline.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Real software, built with AI agents · Emil Vladinov">
<meta name="twitter:description" content="Software engineer in Copenhagen. I ship real software with AI coding agents such as Claude Code. Small steps, tests, review, runtime verification.">
<meta name="twitter:image" content="https://<project>.pages.dev/og.png">
<meta name="twitter:image:alt" content="Real software, built with AI agents. A pixelated portrait of Emil Vladinov beside the headline.">
```

The Build Log head has the same shape with its own title, description, canonical `https://<project>.pages.dev/build-log/`, `og:url`, and the same `og.png`. No preload of the Pose on that page.

### 9.4 Structured data

One JSON-LD script in the head of the home page. Google's policy: mark up only what the page shows. The address stops at the city because the page says "Copenhagen" and nothing more. `knowsAbout` lists topics that appear in the copy. "Claude Code" is not on the page, so it is not in the JSON-LD. The email and the LinkedIn URL come from `src/site.ts`.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://<project>.pages.dev/#website",
      "url": "https://<project>.pages.dev/",
      "name": "Emil Vladinov",
      "inLanguage": "en"
    },
    {
      "@type": "ProfilePage",
      "@id": "https://<project>.pages.dev/#profile",
      "url": "https://<project>.pages.dev/",
      "isPartOf": { "@id": "https://<project>.pages.dev/#website" },
      "dateCreated": "2026-09-02",
      "mainEntity": { "@id": "https://<project>.pages.dev/#person" }
    },
    {
      "@type": "Person",
      "@id": "https://<project>.pages.dev/#person",
      "name": "Emil Vladinov",
      "jobTitle": "Software engineer",
      "description": "Real software, built with AI agents. The agents write the code. The engineering does not change: small steps, tests, review, and runtime verification. Software engineer in Copenhagen.",
      "url": "https://<project>.pages.dev/",
      "image": "https://<project>.pages.dev/avatar/pose-center.webp",
      "email": "emo.vladinov@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Copenhagen",
        "addressCountry": "DK"
      },
      "worksFor": [
        { "@type": "Organization", "name": "Inact" },
        { "@type": "Organization", "name": "Solution 8" }
      ],
      "knowsAbout": [
        "Agentic coding",
        "AI coding agents",
        "Agentic workflows",
        "Code review",
        "Runtime verification",
        "Go",
        "React"
      ],
      "sameAs": [
        "https://github.com/emkataumre",
        "https://www.linkedin.com/in/emil-vladinov/"
      ]
    }
  ]
}
</script>
```

The Build Log page carries one `WebPage`: `@id` `https://<project>.pages.dev/build-log/#page`, `url`, `name` equal to its title, `description` equal to its meta description, `isPartOf` the `#website` id, `about` the `#person` id, `inLanguage` `en`.

### 9.5 Open Graph image

`public/og.png`, 1200 by 630 px, PNG, under 300 KB. That size meets the LinkedIn minimum of 1200 by 627 and the 1.91:1 ratio. X crops it to 2:1, so no text sits in the top or bottom 40 px.

Content: `bg` colour. Left: the headline in the display type, weight 700, about 64 px, `text` colour. Under it, one mono line in `muted`: `Emil Vladinov · Software engineer in Copenhagen`. Right: the Center Pose, 400 px square, radius 40 px, behind the pixel filter. Side padding 80 px.

Production: `scripts/og/og.html` holds the template with the same tokens and the self-hosted Inter. `scripts/og.mjs` opens it with Playwright at a 1200 by 630 viewport, device scale 1, and screenshots to `public/og.png`. The script runs once by hand. The PNG is committed. It is not a build step.

After every change to the image, open the Pages URL in the LinkedIn Post Inspector to refresh the LinkedIn cache.

### 9.6 Favicons

Three files in `public/`:

- `favicon.ico`, 48 by 48 px: the Center Pose behind the pixel filter, cropped to the face. Google prefers a multiple of 48 px.
- `icon.svg`: a `bg` square with the `accent` dot, radius 20 percent.
- `apple-touch-icon.png`, 180 by 180 px: the same image as the ICO.

The build effort makes the two raster files from `og.html` with the same Playwright script, at a 48 px and a 180 px clip.

### 9.7 robots.txt and sitemap.xml

`public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://<project>.pages.dev/sitemap.xml
```

`public/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://<project>.pages.dev/</loc></url>
  <url><loc>https://<project>.pages.dev/build-log/</loc></url>
</urlset>
```

No `lastmod`, `priority`, or `changefreq`. Google ignores the last two and uses `lastmod` only when it is accurate on every build.

Cloudflare adds `X-Robots-Tag: noindex` to preview deployments. The production URL has no such header. The build adds nothing for previews.

### 9.8 Headers

`public/_headers`:

```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

### 9.9 Search Console

The domain property needs DNS. Emil does not control DNS for `pages.dev`, so the property is a URL-prefix property.

1. Add the URL-prefix property `https://<project>.pages.dev/` in Search Console.
2. Choose the HTML file method. Put the file in `public/`. Push. Confirm on the live URL. Then click Verify.
3. Submit `https://<project>.pages.dev/sitemap.xml` in the Sitemaps report.
4. Run URL Inspection on both pages and request indexing.
5. In Bing Webmaster Tools, import the site from Search Console.

The verification file stays in the repo.

### 9.10 Headings

- One `<h1>` per page. Home: the headline. Build Log: the label `Build Log`.
- Section labels in the rail are `<h2>`: Working Method, Selected Work, Build Log. The subline is a `<p>`.
- Principle titles and work entry titles are `<h3>`. On the Build Log page each day date is `<h2>`.
- The name in the nav and the footer is not a heading. The Now strip labels are not headings.
- No skipped levels. Lighthouse `heading-order` passes.

### 9.11 Alt text and links

- Cursor Avatar, Center image: `alt="Pixelated portrait of Emil Vladinov"`. Section 6.2 uses the same value. The other eight images keep `alt=""`. The frame keeps `aria-label="Emil Vladinov"`.
- OG image: the `og:image:alt` value in 9.3. Under 420 characters, the X limit.
- Footer GitHub and LinkedIn links carry `rel="me"`. GitHub links back with `rel="nofollow me"`.
- Language: `<html lang="en">` on both pages. No `hreflang`. The site has one language.

### 9.12 Local signals for a person

Google Business Profile is for a business with a physical location or a service area, not for an employed engineer. The site does not create one. The signals that count for a person, in order:

1. "Copenhagen" in the title, description, lede, and footer. The copy already has it.
2. `PostalAddress` in the Person JSON-LD, city and country only.
3. The same city on LinkedIn and GitHub. Emil sets the LinkedIn city to Copenhagen. He adds the Pages URL under Contact info and as a Featured link. He sets the GitHub website field to the Pages URL and the location to `Copenhagen, Denmark`. These steps are outside the repo.
4. After the site is indexed, a Knowledge Panel claim through the Search Console verification, when a panel exists.

No `geo.*` meta tags. Google ignores them.

### 9.13 Checklist for the build effort

1. Replace `<project>` in the five places from 9.1. `grep -r "<project>"` finds nothing.
2. Both heads match 9.3. The Build Log head has its own title, description, and canonical.
3. The JSON-LD from 9.4 passes the Rich Results Test and the Schema Markup Validator with no error.
4. `og.png` is 1200 by 630. The LinkedIn Post Inspector and the X Card Validator show the image, title, and description.
5. `favicon.ico`, `icon.svg`, `apple-touch-icon.png`, `robots.txt`, `sitemap.xml`, and `_headers` answer 200 on the Pages URL.
6. `curl -I https://<project>.pages.dev/build-log` answers 307 to `/build-log/`. Every internal link uses the slash form.
7. Lighthouse on the Pages URL: SEO 100, `heading-order` passes, LCP under 2.5 s on mobile, CLS under 0.1.
8. Search Console shows the property as verified and the sitemap as read.
9. No analytics, no third-party script, no third-party font request.

## 10. Contact

Footer links, in order: email, GitHub, LinkedIn.

- Email: `emo.vladinov@gmail.com` shown as text, plain `mailto:` link. No obfuscation.
- GitHub: `https://github.com/emkataumre`.
- LinkedIn: `https://www.linkedin.com/in/emil-vladinov/`.

The three values live once in `src/site.ts` and feed the footer, the JSON-LD `sameAs`, and the `rel="me"` links.

No contact form. The nav Contact link scrolls to the footer.

## 11. Activity grids and counters

Source: research at `.scratch/portfolio-spec/research/activity-data.md`. Emil's approach, verified: no backend. A scheduled job on Emil's Windows machine pulls the numbers from both GitHub accounts and from the local Claude Code history, commits one JSON file to `main`, and Cloudflare Pages deploys.

### 11.1 What the Reader sees

The Activity block sits under the Build Log teaser link, inside the Build Log section.

- Grid 1, **Commits**: a GitHub-style contribution grid of commits per day across both accounts, merged. Views: 7, 30, and 365 days, switched by three text buttons. Hover or focus on a cell shows the date and the count.
- Grid 2, **Claude Code sessions**: the same grid for sessions per day. Label: `Sessions where I typed a prompt`. A streak line: `Current streak: N days`.
- Counter row, mono, muted labels: `Commits`, `Pull requests merged`, `Lines changed on main` (added and removed), `Issues I opened, now closed`, `Repositories`, `Claude Code sessions`, `Active days`. The row caption shows the `since` date once.
- Stamp under the block: `Updated <date>`. After three days with no update: `Last update <date>. The job runs on my machine when it is on.`
- No per-account split, no login names, no repository names. The Inact figures in Selected Work stay Testimony. Private repository work appears only inside the merged counts.
- Do not show GitHub's contribution calendar total. A live probe showed it drops private commits.

Grid cells: 11 px squares, 3 px gap, five steps of the accent from `accent-soft` to `accent`. Empty days use `line`. The 365 view scrolls horizontally under 760 px.

Reduced motion: no cell animation. Otherwise the grids fade in as one block with the standard reveal.

### 11.2 Data file

`src/activity/activity.json`, committed, about 3 KB, bundled by Vite. No runtime fetch.

```ts
type Activity = {
  generatedAt: string;           // ISO 8601
  timeZone: "Europe/Copenhagen";
  days: { from: string; to: string };   // 365 days inclusive
  commits: number[];             // 365 ints, index 0 = from, both accounts merged
  sessions: number[];            // 365 ints, Claude Code sessions with a typed prompt
  streak: { days: number; endsOn: string };
  counters: {
    since: string;
    commits: number; linesAdded: number; linesRemoved: number;
    pullRequestsMerged: number; issuesOpenedNowClosed: number; repositories: number;
    claudeSessions: number; claudeActiveDays: number;
  };
};
```

The 7 and 30 day views are slices of the same arrays.

### 11.3 The job

`scripts/activity.mjs`, Node, no Claude Code in the loop.

1. Read the previous `activity.json`. Merge into it. Never rebuild the year from scratch, because Claude Code transcripts are swept after 30 days.
2. For each GitHub account: `GH_TOKEN=$(gh auth token --user <login>)`. GraphQL `repositoriesContributedTo(contributionTypes: [COMMIT])`, then per repository `defaultBranchRef.target.history(author: {id}, since:)`. Group by `authoredDate` in Europe/Copenhagen. Sum `additions` and `deletions`. Drop commits whose subject starts with `activity: `. Search `author:<login> is:pr is:merged` and `author:<login> is:issue is:closed` for the two counters. Cost: about 1 point per query against 5,000 per hour.
3. Claude Code sessions: read `~/.claude/history.jsonl`. Count distinct session ids per day that have a typed prompt. The streak is the run of consecutive active days that ends today or yesterday. Only integers leave the machine.
4. Write the JSON. If it changed, commit as author `activity-bot` with subject `activity: <date>` and push with the personal account token.
5. The job runs in its own clone at `%LOCALAPPDATA%\portfolio-activity\` and does `git pull --rebase` first.

Schedule: Windows Task Scheduler, registered through PowerShell with `New-ScheduledTaskSettingsSet -StartWhenAvailable`, a 10 minute time limit, twice a day, run with a stored password so `gh` can read Windows Credential Manager. The machine must be on. The stamp in 11.1 keeps that honest.

Builds: about 62 job builds per month against the 500 per month free plan limit.

Nothing secret enters the repo. The tokens stay in `gh auth` on Emil's machine.

### 11.4 Open points for the build

- Whether search returns private organisation issues and pull requests for the work token. Check on the first run and drop the counter if it is wrong.
- Whether to show the lines counter at all. It includes lock files and generated code. The label says so.

## 12. Definition of done for the build

- Both pages render with the final copy, tokens, and motion from this spec.
- Cursor Avatar tracks the pointer on desktop, drifts on touch, and stays static under reduced motion.
- Build Log renders from git history on Cloudflare Pages with `source=git`, and no `activity:` commit appears in it.
- The activity job ran twice from Task Scheduler, the JSON changed, and the site shows the new stamp.
- Lighthouse on the Pages URL: no accessibility failure, no console error.
- The Playwright check loop passes on both viewports for both pages.
- The site is live on the `*.pages.dev` URL and the URL is on the map.
