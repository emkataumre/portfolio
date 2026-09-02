# Build Log generation from git history

Type: research
Status: open
Blocked by: none

## Question

How does a Vite + React site render the Build Log from its own git history at build time, with short human annotations? Compare: a build script that reads `git log` into JSON, an annotations file keyed by commit or by day, and a plain markdown file per day. Cover Cloudflare Pages build constraints (git depth, available binaries). Recommend one approach and a data shape.
