# Research: Build Log generation from git history

Ticket: `.scratch/portfolio-spec/issues/06-build-log-generation.md`
Date: 2026-09-02
Status: findings complete

## Question

How does a Vite + React site render the Build Log from its own git history at build time, with short human annotations? Compare three approaches. Cover Cloudflare Pages build constraints. Recommend one approach and a data shape.

## Summary

1. Cloudflare Pages clones the repo shallow. The `git` binary is present in the build container. Prefix the build command with `git fetch --unshallow` to get the full history.
2. Read `git log` in a prebuild Node script. Write `src/build-log/build-log.json`. Import the JSON in React. Vite bundles it.
3. Keep human annotations in one file, `build-log/annotations.md`, with one section per day. The build script merges annotations with commits by day.
4. Serve `/build-log` as a real second HTML page through the Vite multi-page build. No router library.
5. If git history is missing, the build script writes an empty commit list and a `source: "fallback"` flag. The page shows the annotations alone and a note.

## Cloudflare Pages build facts

| Fact | Value | Source |
| --- | --- | --- |
| Default Node.js | 22.16.0 on the v3 build image | [Build image](https://developers.cloudflare.com/pages/configuration/build-image/) |
| Pin Node | `NODE_VERSION` env var, `.nvmrc`, or `.node-version` | [Build image](https://developers.cloudflare.com/pages/configuration/build-image/) |
| Vite + React build | Build command `npm run build`. Output directory `dist` | [Deploy a React site](https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/) |
| Build-time env vars | `CI`, `CF_PAGES`, `CF_PAGES_COMMIT_SHA`, `CF_PAGES_BRANCH`, `CF_PAGES_URL` | [Build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/) |
| Clone depth | Shallow. Cloudflare docs do not state this. Quartz docs and Cloudflare community threads state it and give the fix `git fetch --unshallow && <build>` | [Quartz hosting guide](https://quartz.jzhao.xyz/hosting), [Cloudflare community](https://community.cloudflare.com/t/git-last-modified-front-matter-attribute-not-respected-with-11ty/408853) |
| `git` binary | Present. The Cloudflare tool table does not list it, but the `git fetch --unshallow` workaround runs inside the build command, so the binary exists | Same as above |
| SPA fallback | With no `404.html`, Pages serves `index.html` for every unmatched path. With a `build-log/index.html` file, Pages serves that file for `/build-log` and `/build-log/` | [Serving Pages](https://developers.cloudflare.com/pages/configuration/serving-pages/) |
| Rewrites | `_redirects` supports `200` proxy rules for internal paths | [Redirects](https://developers.cloudflare.com/pages/configuration/redirects/) |

Two cautions:

- The shallow clone fact rests on second-party sources. Verify it in the first Pages build. Run `git rev-parse --is-shallow-repository` in the build script and print the result. Git documents this flag at [git-rev-parse](https://git-scm.com/docs/git-rev-parse).
- `git fetch --unshallow` exits with an error when the repo is already complete. Local builds hit this. Run the fetch only when `--is-shallow-repository` prints `true`. Git documents `--unshallow` at [git-fetch](https://git-scm.com/docs/git-fetch).

Cloudflare now presents Workers with static assets as the broader platform and provides a [migration guide from Pages](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/). Workers Builds injects different variables (`WORKERS_CI_COMMIT_SHA`, `WORKERS_CI_BRANCH`). The map decision says Pages. The build script must not depend on `CF_PAGES_*` names, so a later move costs nothing.

## Vite build-time data options

| Option | How | Fit | Source |
| --- | --- | --- | --- |
| Prebuild script writes JSON into `src/` | `node scripts/build-log.mjs` runs before `vite build`. React imports the JSON file | Simple. The JSON is a plain file that tests and local dev can read. Vite bundles JSON imports with no plugin | [Vite features](https://vite.dev/guide/features.html) |
| `define` | `define: { __BUILD_LOG__: JSON.stringify(data) }` in `vite.config.ts` | Works for small constants. A large object inlined at every use site is a poor fit | [Shared options](https://vite.dev/config/shared-options.html) |
| Virtual module | A plugin with `resolveId` and `load` hooks serves `virtual:build-log` | Clean import, but it is a custom plugin for one import. Not simpler than a JSON file | [Plugin API](https://vite.dev/guide/api-plugin.html) |
| `import.meta.glob` with `?raw` | Import a folder of markdown files as strings | Good for the markdown-per-day approach. Parsing moves into the browser bundle | [Glob import](https://vite.dev/guide/features.html#glob-import) |

The prebuild script wins on simplicity. It also gives one place to handle the shallow-clone fallback.

## Second route options

| Option | Cost | Notes | Source |
| --- | --- | --- | --- |
| Vite multi-page build | Zero runtime bytes. One extra `build-log/index.html` and one entry in `rollupOptions.input` | Pages serves `build-log/index.html` for `/build-log`. Each page is its own React root. Shared components import from `src/`. No client router | [Vite multi-page](https://vite.dev/guide/build.html#multi-page-app), [Serving Pages](https://developers.cloudflare.com/pages/configuration/serving-pages/) |
| Hash route `/#/build-log` | Zero bytes | Ugly URL. The Build Log needs a clean link for the Reader | none needed |
| wouter | About 2.2 KB | Fine, but the site has two pages and no params | [wouter](https://github.com/molefrog/wouter) |
| react-router | Larger. Full feature set | Too much for two pages | [React Router](https://reactrouter.com/start/declarative/installation) |

Pick the multi-page build. It matches Cloudflare static hosting with no fallback rules and no runtime router. The Build Log page gets its own `<title>` and meta tags for free.

## The three approaches from the ticket

### A. Build script reads `git log` into JSON

The script runs `git log --pretty=format:%H%x1f%h%x1f%aI%x1f%s%x1f%b%x1e` and splits on the record separators. Git documents these placeholders at [git-log](https://git-scm.com/docs/git-log). The script writes `src/build-log/build-log.json`.

Strengths: the data is verifiable. Every entry links to a commit on GitHub. No manual work per commit.

Weakness: raw commits alone do not tell the Reader why the work happened. Commit subjects are terse.

### B. Annotations file keyed by commit or by day

A human writes a short note per key. The build merges notes with commits.

Keyed by commit: precise, but fragile. Rebases and squashes change hashes. Emil must copy hashes by hand.

Keyed by day: stable. A day groups a work session. Notes stay short. This matches how the Reader scans a log.

### C. Plain markdown file per day

Each `build-log/2026-09-02.md` is one entry. The build imports the folder with `import.meta.glob`.

Strengths: easy to write. Weakness: it is a manual devlog. It loses the link to commits unless Emil pastes hashes. The map says the Build Log is "the only verifiable artifact". Manual prose alone is Testimony, not a record.

### Recommendation

Combine A and B, keyed by day. The git log gives the verifiable spine. One annotations file gives the human voice. One file is easier to maintain than a folder. The day key survives rebases.

Do not adopt C. Keep the markdown-per-day idea in reserve if the annotations file grows past about forty days.

## Data shape

### Build script output: `src/build-log/build-log.json`

```ts
export type BuildLogCommit = {
  sha: string;        // full hash, for the GitHub link
  shortSha: string;   // 7 chars, for display
  date: string;       // author date, ISO 8601 strict (%aI)
  subject: string;    // first line of the message
  body: string;       // rest of the message, may be empty
  filesChanged: number;
};

export type BuildLogDay = {
  day: string;               // "2026-09-02", from the commit date in Europe/Sofia time
  note: string | null;       // annotation for that day, or null
  commits: BuildLogCommit[]; // newest first
};

export type BuildLog = {
  generatedAt: string;                 // ISO 8601
  source: "git" | "fallback";          // "fallback" when git history was not available
  repoUrl: string;                     // "https://github.com/<owner>/<repo>"
  headSha: string | null;              // from git, or CF_PAGES_COMMIT_SHA, or null
  days: BuildLogDay[];                 // newest first
};
```

Pick the timezone once and write it in the script. Commit dates carry an offset. Group by the calendar day in that timezone so a late evening commit stays on the day Emil worked.

### Annotations file: `build-log/annotations.md`

Plain markdown. One `##` heading per day. The heading text is the ISO date. The body under the heading is the note. Nothing else.

```md
# Build Log annotations

## 2026-09-02

Planning day. Charted the spec map and opened ten tickets. No site code yet.

## 2026-09-03

Ran the research tickets in parallel worktrees. Decided on a multi-page Vite build.
```

Rules for the note:

- Two to four sentences. STE-flavoured prose.
- No customer names, colleague names, or internal issue numbers. The map says this file is public.
- Write the note on the day or the next morning. Do not backfill more than a week later.

The parser is small. Split on `^## (\d{4}-\d{2}-\d{2})$` and trim the body. Days with commits but no note render with `note: null`. Days with a note but no commits still render, so a planning day counts.

### Build command

`package.json`:

```json
{
  "scripts": {
    "prebuild": "node scripts/build-log.mjs",
    "build": "tsc -b && vite build"
  }
}
```

Cloudflare Pages build command: `npm run build`. Output directory: `dist`. npm runs `prebuild` before `build` by convention. The script itself runs `git fetch --unshallow` when needed, so the Pages build command stays the default.

Add the generated JSON file to `.gitignore`. The build always regenerates it. A committed copy would go stale and would create a commit for every build.

## Fallback when git history is not available

The script must never fail the build. Order of attempts:

1. Run `git rev-parse --is-shallow-repository`. If `true`, run `git fetch --unshallow`. Continue on error.
2. Run `git log`. If it succeeds and returns more than one commit, write `source: "git"`.
3. If `git` is missing, or the log has one commit and the repo is still shallow, write `source: "fallback"` with an empty `commits` array per day and `headSha` from `CF_PAGES_COMMIT_SHA` when set.
4. Print one line to the build output: `build-log: source=git commits=42` or `build-log: source=fallback reason=<text>`.

The page reads `source`. In fallback mode it shows the annotations as dated notes and a short line: "Commit history was not available at build time. See the repository on GitHub." The GitHub link still lets the Reader verify.

## Open decisions for the parent

- Timezone for the day grouping. Proposal: `Europe/Sofia`.
- Whether the `.scratch` map files show in the Build Log as rendered pages or as GitHub links. This research assumes GitHub links only.
- Whether merge commits appear. Proposal: pass `--no-merges` to `git log`. Squash merges then show as one commit each.

## Sources

- Cloudflare Pages build image: https://developers.cloudflare.com/pages/configuration/build-image/
- Cloudflare Pages build configuration: https://developers.cloudflare.com/pages/configuration/build-configuration/
- Cloudflare Pages, deploy a React site: https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/
- Cloudflare Pages serving behaviour: https://developers.cloudflare.com/pages/configuration/serving-pages/
- Cloudflare Pages redirects: https://developers.cloudflare.com/pages/configuration/redirects/
- Cloudflare migrate from Pages to Workers: https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/
- Cloudflare Workers Builds configuration: https://developers.cloudflare.com/workers/ci-cd/builds/configuration/
- Quartz hosting guide, shallow clone note: https://quartz.jzhao.xyz/hosting
- Cloudflare community, 11ty git dates on Pages: https://community.cloudflare.com/t/git-last-modified-front-matter-attribute-not-respected-with-11ty/408853
- Vite shared options, `define`: https://vite.dev/config/shared-options.html
- Vite plugin API, virtual modules: https://vite.dev/guide/api-plugin.html
- Vite multi-page build: https://vite.dev/guide/build.html#multi-page-app
- Vite glob import: https://vite.dev/guide/features.html#glob-import
- wouter: https://github.com/molefrog/wouter
- React Router declarative mode: https://reactrouter.com/start/declarative/installation
- git log pretty formats: https://git-scm.com/docs/git-log
- git fetch `--unshallow`: https://git-scm.com/docs/git-fetch
- git rev-parse `--is-shallow-repository`: https://git-scm.com/docs/git-rev-parse
