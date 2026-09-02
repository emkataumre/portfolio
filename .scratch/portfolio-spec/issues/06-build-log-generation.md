# Build Log generation from git history

Type: research
Status: resolved
Blocked by: none

## Question

How does a Vite + React site render the Build Log from its own git history at build time, with short human annotations? Compare: a build script that reads `git log` into JSON, an annotations file keyed by commit or by day, and a plain markdown file per day. Cover Cloudflare Pages build constraints (git depth, available binaries). Recommend one approach and a data shape.

## Answer

- A prebuild Node script reads `git log` and writes `src/build-log/build-log.json`. React imports the JSON.
- Cloudflare Pages clones shallow. The script runs `git fetch --unshallow` when `git rev-parse --is-shallow-repository` prints `true`. Node 22 and `git` are present.
- Human notes live in one file, `build-log/annotations.md`, one `##` section per ISO day. The script merges notes and commits by day. Day keys survive rebases.
- `/build-log` is a second HTML entry in the Vite multi-page build. No router library. Pages serves `build-log/index.html` for the path.
- If git history is missing, the script writes `source: "fallback"` and the page shows notes only with a GitHub link. Open: timezone, merge commits, how `.scratch` files appear.

Findings: [research/build-log-generation.md](../research/build-log-generation.md)
