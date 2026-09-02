# Research: stack scaffold and Cloudflare Pages deploy

Ticket: `.scratch/portfolio-spec/issues/07-stack-scaffold-and-deploy.md`
Date: 2026-09-02
Sources: npm registry, official docs of each tool, the Playwright MCP README, and the Claude Code MCP docs. Each section cites its source.

## 1. Version table

Versions are the `latest` dist-tag on the npm registry on 2026-09-02.

| Package | Latest | Note |
| --- | --- | --- |
| `vite` | 8.2.2 | Rolldown bundler. Needs Node 20.19+ or 22.12+. |
| `@vitejs/plugin-react` | 6.1.1 | Uses Oxc for React Refresh. No Babel. Peer: `vite ^8`. |
| `react`, `react-dom` | 19.2.8 | |
| `@types/react`, `@types/react-dom` | 19.2.18, 19.2.5 | |
| `typescript` | 7.0.2 | The Vite `react-ts` template pins `~6.0.2`. See gotcha 1. |
| `tailwindcss`, `@tailwindcss/vite` | 4.3.3 | Vite plugin. No PostCSS config. No `tailwind.config.js`. |
| `motion` | 13.2.0 | The current package name. Import from `motion/react`. |
| `framer-motion` | 13.2.0 | Legacy name. Same code. Do not install both. |
| `wouter` | 3.10.0 | Optional light router, about 2.2 KB gzipped. |
| `@playwright/mcp` | 0.0.80 | Runs through `npx`. |

Sources:
- Vite 8 announcement: https://vite.dev/blog/announcing-vite8 ("Vite 8 ships with Rolldown as its single, unified, Rust-based bundler", "requires Node.js 20.19+, 22.12+").
- Vite guide: https://vite.dev/guide/
- Vite `react-ts` template `package.json`: https://github.com/vitejs/vite/blob/main/packages/create-vite/template-react-ts/package.json
- TypeScript 7.0 announcement (2026-07-08): https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/
- Tailwind with Vite: https://tailwindcss.com/docs/installation/using-vite
- Motion upgrade guide: https://motion.dev/docs/react-upgrade-guide

## 2. Scaffold checklist

Do not run these steps in the planning effort. The build effort runs them in order.

1. Check Node. Run `node -v`. The version must be 20.19+ or 22.12+. Source: https://vite.dev/guide/
2. Create the project. Run `npm create vite@latest portfolio -- --template react-ts`. Then `cd portfolio`. Source: https://vite.dev/guide/
3. Install Tailwind. Run `npm install tailwindcss @tailwindcss/vite`. Source: https://tailwindcss.com/docs/installation/using-vite
4. Install Motion. Run `npm install motion`. Do not install `framer-motion`. Source: https://motion.dev/docs/react-upgrade-guide
5. Register the Tailwind plugin in `vite.config.ts`:

   ```ts
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   import tailwindcss from '@tailwindcss/vite'

   export default defineConfig({
     plugins: [react(), tailwindcss()],
   })
   ```

6. Replace the content of `src/index.css` with one line: `@import "tailwindcss";`. Delete the template CSS in `src/App.css`. Source: https://tailwindcss.com/docs/installation/using-vite
7. Pin Node for Cloudflare. Create `.nvmrc` at the repo root with the content `22`. Source: https://developers.cloudflare.com/pages/configuration/build-image/
8. Add the second route. See section 4. Choose one of the two options there.
9. Wrap the app in `MotionConfig`. See section 5.
10. Check the build. Run `npm run build`. The template script is `tsc -b && vite build`. The output goes to `dist/`.
11. Check the build output locally. Run `npm run preview` and open the printed URL.
12. Do not add `public/404.html`. Its absence turns on the SPA fallback on Cloudflare Pages. See section 3.
13. Commit and push to the public GitHub repo. Then connect the repo in Cloudflare (section 3).

Gotchas:

1. TypeScript 7 is out, but the Vite template pins `typescript ~6.0.2`. Keep the template pin for v1. TypeScript 7 removed `baseUrl` and `moduleResolution: classic`, and "does not yet expose a stable programmatic API", which affects bundler tooling. Source: https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/
2. Tailwind v4 needs no `postcss.config.js` and no `tailwind.config.js`. Theme tokens go in CSS with `@theme`. Source: https://tailwindcss.com/docs/installation/using-vite
3. The `dark:` variant follows `prefers-color-scheme` by default. This matches the "system-preference dark theme" decision. No toggle code is needed. Source: https://tailwindcss.com/docs/dark-mode
4. Motion 13 removed `@emotion/is-prop-valid`. This only affects CSS-in-JS users. Not relevant with Tailwind. Elements with `whileTap` now get `tabindex="0"`. Source: https://motion.dev/docs/react-upgrade-guide
5. The `@vitejs/plugin-react` v6 peer dependency is `vite ^8`. Do not mix it with Vite 7.

## 3. Cloudflare Pages settings

Connect the repo:

1. Cloudflare dashboard, then **Workers & Pages**.
2. **Create application** > **Pages** > **Import an existing Git repository** (the Git integration page names the same button **Connect to Git**).
3. Sign in to GitHub and complete **Install & Authorize** for the repo.
4. Select the repo. Set **Production branch** to `main`. At least one branch must exist on GitHub before this dropdown fills.

Build settings:

| Setting | Value |
| --- | --- |
| Framework preset | React (Vite) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | leave empty (repo root) |
| Node version | `.nvmrc` in the repo root, or `NODE_VERSION` env var |

Facts:

- The project gets a free subdomain on `*.pages.dev`. Every pull request gets a preview deployment. Every push to `main` deploys to production. Non-production branches deploy as previews.
- Default Node in the v3 build image is 22.16.0. It satisfies Vite 8. Pin it anyway with `.nvmrc`, so the build does not change under you.
- SPA fallback: "If your project does not include a top-level `404.html` file, Pages assumes that you are deploying a single-page application" and serves `index.html` for every path. No `_redirects` file is needed for `/build-log`.
- If a `_redirects` file is ever needed, it goes in `public/` so Vite copies it into `dist/`. Format: `[source] [destination] [code?]`.
- Free plan limits: 500 builds per month, 20,000 files per site, 25 MiB per file.

Sources:
- https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/
- https://developers.cloudflare.com/pages/get-started/git-integration/
- https://developers.cloudflare.com/pages/configuration/build-configuration/
- https://developers.cloudflare.com/pages/configuration/build-image/
- https://developers.cloudflare.com/pages/configuration/serving-pages/
- https://developers.cloudflare.com/pages/configuration/redirects/
- https://developers.cloudflare.com/pages/platform/limits/

## 4. Second route for the Build Log without a heavy router

Two options. Both work with the Pages SPA fallback.

Option A, no dependency. Read `window.location.pathname` once, render `BuildLog` for `/build-log` and `Home` for everything else. Links are plain `<a href="/build-log">`. Each click is a full page load. About 10 lines of code. Fits a two-page site.

Option B, `wouter`. Run `npm i wouter`. About 2.2 KB gzipped. Client-side navigation, no reload.

```tsx
import { Link, Route, Switch } from "wouter"

<Switch>
  <Route path="/build-log"><BuildLog /></Route>
  <Route path="/"><Home /></Route>
  <Route>Not found</Route>
</Switch>
```

Source: https://github.com/molefrog/wouter

Recommendation: Option A for v1. Add `wouter` only if the Build Log needs deep links per entry.

## 5. Reduced motion pattern

Two layers. Use both.

Layer 1, global. Wrap the tree once:

```tsx
import { MotionConfig } from "motion/react"

<MotionConfig reducedMotion="user">
  <App />
</MotionConfig>
```

With `"user"`, all motion components "automatically disable transform and layout animations, while preserving the animation of other values like `opacity` and `backgroundColor`". This gives "reveals become fades" for free: a reveal that animates `y` and `opacity` keeps only the opacity part.

Layer 2, per component. The Cursor Avatar must go static, not fade. Use the hook:

```tsx
import { useReducedMotion } from "motion/react"

const reduce = useReducedMotion()
if (reduce) return <img src={poses.rest} alt="" />
```

The hook returns a boolean and works with any React code, not only motion components. Use it for the avatar, the scroll-linked moments, and any `useScroll` effect.

Sources:
- https://motion.dev/docs/react-accessibility
- https://motion.dev/docs/react-use-reduced-motion

Scroll reveals use `whileInView` with `viewport={{ once: true }}`. Source: https://motion.dev/docs/react-scroll-animations

## 6. Playwright MCP visual-check loop

Configuration. The user scope already has the server in `~/.claude.json`:

```json
"playwright": {
  "command": "cmd",
  "args": ["/c", "npx", "-y", "@playwright/mcp@latest", "--image-responses", "omit"]
}
```

To share the server through the repo instead, add a project-scope entry:

```
claude mcp add playwright --scope project -- npx -y @playwright/mcp@latest
```

This writes `.mcp.json` at the repo root. Claude Code asks for approval the first time it loads. Source: https://code.claude.com/docs/en/mcp

Gotcha: `--image-responses omit` means screenshots do not come back inline. Always pass `filename` to `browser_take_screenshot`, then open the file with the Read tool. Useful flags: `--headless`, `--viewport-size 1280x720`, `--device "iPhone 15"`, `--isolated`. Source: https://github.com/microsoft/playwright-mcp

Minimal loop per change:

1. Run `npm run dev` in the background. Note the URL, normally `http://localhost:5173`.
2. `browser_resize` with `width: 1280`, `height: 800`.
3. `browser_navigate` with `url: "http://localhost:5173/"`.
4. `browser_snapshot` to read the accessibility tree. Check headings, landmarks, and link text.
5. `browser_take_screenshot` with `filename: ".scratch/shots/home-desktop.png"`. Read the file.
6. `browser_resize` with `width: 390`, `height: 844` for a phone viewport.
7. `browser_take_screenshot` with `filename: ".scratch/shots/home-mobile.png"`, `fullPage: true`. Read the file.
8. `browser_navigate` to `http://localhost:5173/build-log`. Repeat steps 4 to 7.
9. `browser_console_messages` with `level: "error"`. The list must be empty.
10. Fix, then repeat from step 3.

Reduced motion check: `browser_resize` does not toggle media features. Use `browser_run_code_unsafe` with a Playwright `page.emulateMedia({ reducedMotion: "reduce" })` call, then reload and screenshot. Keep `.scratch/shots/` out of git.

Tool names and parameters: https://github.com/microsoft/playwright-mcp

## 7. Open points for the parent

- Route option: A (pathname switch, no dependency) or B (`wouter`).
- TypeScript: stay on the template pin `~6.0.2` for v1, or move to 7.
- Project-scope `.mcp.json` for Playwright in the site repo, or keep the user-scope config only.
