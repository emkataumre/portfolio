# Inact scan (2026-09-02)

Read-only scan of the Inact platform monorepo. Customer data, colleague names, and internal issue numbers are left out on purpose. Nothing here is copy for the site. The Selected Work ticket decides what to publish.

## Product

- Inact. B2B analytics and action-management SaaS for assortment and supply-chain data (ABC classification, insights, end-to-end grids, heatmaps, dashboards, action lists).
- Go + React monorepo, six apps. Emil works mainly in Inact Now (customer web app: Go API with gorilla/mux, GORM, MySQL; React 19, Vite, TS/JS, SCSS, hand-rolled Redux) and Inact Manager (internal admin UI: React 19, Vite, TS, Tailwind 3, Headless UI, vitest).
- First commit February 2016. About 415k lines (Go 123k, TSX 221k, TS 32k). About 3,150 tracked files, 14,600 commits, roughly 12 contributors.
- Monthly milestone branches merge into main. No shared lint, no e2e, Inact Now had no test runner in CI.

## Emil

- Tenure May 2026 to present. 441 commits (332 non-merge). About +34k / -13k lines, 96 new files, 43 Go files touched.
- About 134 commits on main via the June and August milestones. About 290 on the `tasks-now` branch, tracked for the September milestone, not yet on main.
- Introduced agentic coding alone. The team does not use Claude. All agent tooling is local and excluded from git: per-app CLAUDE.md files, custom skills (find-similar, component-lookup, visual-diff, ground-issue, typecheck), a convention-scout subagent, draft-commit and describe-issue commands, an AFK loop scaffold, runtime verification scripts.

## Deliveries

- Tasks feature. End-to-end action-management layer: Go models, routes, migrations, mail and notifications, Redux architecture, composer, list, cards, badges on seven grid surfaces, My Tasks page, permissions, per-org kill switch, state workflow, duplicate detection, cascade delete. About 21k lines, 154 files, all commits Emil's. In final review for the September release.
- References system (@ and # mentions). Storage and resolution primitive, ranked preview and search endpoints, chip-aware composer shared by comments and tasks. About 5k lines.
- Template task configs with transactional propagation to derived action lists, UID backfill, inheritance panel. About 2.8k lines.
- Task notifications and digest emails with timezone handling. About 1.7k lines.
- End-to-end grid UX rework: edit mode with save, slicer chips, fixed-slicer popups, about dialog. About 3.5k lines.
- Download notifications bell, persisted across navigation, orphan recovery. About 1k lines. On main.
- Manager dashboard and organisation filters, persisted setting, users table. About 1.5k lines. On main.
- ClickUp to GitHub issue sync workflow. On main.

## Quality signals

- Dedicated self-review fix commits on the Tasks epic: Go security and data integrity, Go lifecycle, Now frontend, Manager frontend, safety review, runtime verification.
- July consolidation commits: shared helpers extracted, dead code removed, conventions aligned.
- Added vitest config and first component and reducer tests, two Go tests, revived orphaned test helpers.
- Seven migration commits, all guarded and backfilled.
