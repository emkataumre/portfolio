# Research: activity calendars and live counters

Ticket: spec section 11, deferred features.
Date: 2026-09-02
Status: findings complete

## Question

Emil wants two features after v1: a commit calendar across both GitHub accounts with 7, 30, and 365 day views, plus a Claude Code session calendar with a streak, and live counters (commits, lines, issues, pull requests). His proposed mechanism: no backend. A scheduled job on his own Windows machine, authorized with both accounts, runs once or twice a day, pulls the numbers, and commits a JSON file to the public repo. Cloudflare Pages then deploys. Does this work, and what must change?

## Summary

Verdict: yes, the approach works, with five adjustments.

1. Do not use the GitHub contribution calendar for the commit counts. A live probe on the org account showed that `contributionsCollection` omitted 150 commits in two private repositories that the account author wrote on the default branch. Walk the default branch of each repository with `history(author: {id}, since:)` instead. The walk saw every commit and also returns `additions` and `deletions` per commit.
2. Claude Code has no usage API. Count sessions from the local files. Claude Code deletes transcripts after 30 days by default, so the job must merge each run into the previous `activity.json` and never rebuild the year from scratch.
3. A plain Node script is enough. Claude Code headless adds cost and nondeterminism and nothing else.
4. The job runs in its own clone, commits with the subject prefix `activity: `, and the Build Log script and the activity walk both exclude that prefix. Otherwise the bot inflates the commit calendar and pollutes the Build Log.
5. Task Scheduler cannot run a task while the machine sleeps. Set "run as soon as possible after a missed start" through PowerShell, and show `generatedAt` on the page as "Updated <date>" so a stale number is visibly stale.

## Findings

### A. GitHub data

**Multiple accounts in `gh`.** `gh auth status` on this machine lists three accounts on github.com, all with `repo` scope. `gh auth switch --user <login>` changes the active account. `gh auth token --user <login>` prints the token of a named account without a switch. `GH_TOKEN` in the environment "takes precedence over previously stored credentials". The job therefore never switches the active account. It calls `GH_TOKEN=$(gh auth token --user <login>) gh api graphql ...` once per account. Sources: [gh auth switch](https://cli.github.com/manual/gh_auth_switch), [gh auth token](https://cli.github.com/manual/gh_auth_token), [gh environment](https://cli.github.com/manual/gh_help_environment).

**The contribution calendar is not reliable for private work.** The schema says `contributionCalendar` gives "How many contributions were made by the user on this day" per `ContributionCalendarDay`, and `commitContributionsByRepository[].contributions.nodes[]` gives `occurredAt` and `commitCount`, "How many commits were made on this day to this repository by the user". A live query on the personal account returned correct per-day commit counts. The same query on the org account, for 2026-05-01 to 2026-09-03, returned 23 commits in one public repository and `restrictedContributionsCount: 0`. A second query on the same token, `repositoriesContributedTo(privacy: PRIVATE, contributionTypes: [COMMIT])` and then `defaultBranchRef.target.history(author: {id: <viewer>}, since: "2026-05-01")`, returned 134 commits in a private org repository and 16 in a private personal repository. The author of every one of those commits resolves to the viewer. Neither repository is a fork. GitHub documents the rules for the calendar (linked email, default branch, not a fork, up to 24 hours delay) and the probe met all of them. The cause is unknown. The calendar numbers cannot be trusted for the work account. Sources: schema introspection through `gh api graphql`, [Why are my contributions not showing up](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile/why-are-my-contributions-not-showing-up-on-my-profile).

**The commit walk is reliable and cheap.** Per account: list `repositoriesContributedTo(contributionTypes: [COMMIT], includeUserRepositories: true)` with pagination, then for each repository read `defaultBranchRef.target.history(author: {id}, since: <365 days ago>, first: 100)` with pagination. Each node gives `authoredDate`, `additions`, `deletions`, and `messageHeadline`. Group by the authored date in `Europe/Copenhagen`, the same rule as the Build Log. The probe above cost one point per query. The GraphQL primary limit is 5,000 points per hour per user. A year of Emil's commits is a few thousand nodes, so a run costs well under 100 points. Twice a day is irrelevant to the limit. Sources: schema introspection, [GraphQL rate limits](https://docs.github.com/en/graphql/overview/rate-limits-and-node-limits-for-the-graphql-api), [REST rate limits](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api).

**Limits of the walk.** It counts commits on the default branch only. Unmerged branch work does not show. A squash merge counts as one commit. That is the honest meaning of "shipped". The walk sees the personal account's own `activity: ` bot commits, so the script must drop commits whose `messageHeadline` starts with that prefix.

**Lines of code.** The GraphQL `Commit` type has `additions` and `deletions`, so the walk gives exact line counts per commit at no extra cost. The REST `stats/contributors` endpoint is the alternative. It returns weekly buckets `a`, `d`, `c` per contributor per repository, returns `202` until GitHub computes the cache, and "will return 0 values for all addition and deletion counts in repositories with 10,000 or more commits". The private org repository on the probe has 13,929 commits, so REST stats would report zero lines for it. Use the walk. Source: [Repository statistics](https://docs.github.com/en/rest/metrics/statistics).

**Issues and pull requests.** GraphQL `search(type: ISSUE, query: "author:<login> is:pr is:merged")` returns `issueCount`. The personal account returns 218 merged pull requests and 307 closed issues opened by Emil. The search index covers repositories the token can read. The two accounts have different logins, so the job runs the search twice and adds. Two honest labels exist: "pull requests merged" and "issues I opened that are now closed". "Issues closed" without the qualifier would overstate it.

**Which counters are honest.**

| Counter | Source | Honest | Note |
| --- | --- | --- | --- |
| Commits per day, 365 days | commit walk, both accounts | yes | default branch, authored date, bot commits excluded |
| Commits total since a date | sum of the above | yes | |
| Lines added and removed | `additions` and `deletions` from the walk | yes, with a label | includes lock files and generated files, so label it "lines changed on main" |
| Pull requests merged | search, `author: is:pr is:merged` | yes | |
| Issues closed | search, `author: is:issue is:closed` | yes, with a label | "issues I opened that are now closed" |
| Repositories | `repositoriesContributedTo` count | yes | |
| Contribution calendar total | `contributionCalendar` | no | omits private work on the org account |

### B. Claude Code sessions per day

**Where the data is.** Transcripts are at `~/.claude/projects/<project>/<session-id>.jsonl`. On this machine that is `C:\Users\EmilVladinov\.claude\projects\`. The docs state the format "is internal to Claude Code and changes between versions". Each transcript line is a JSON object. The first `type: "user"` line carries `timestamp` (ISO 8601 UTC), `sessionId`, and `cwd`. Two more files exist at `~/.claude/`: `history.jsonl`, documented as "Every prompt you've typed, with timestamp and project path", with fields `display`, `pastedContents`, `timestamp` (Unix milliseconds), `project`, `sessionId`. And `stats-cache.json`, documented as "Aggregated token and cost counts shown by `/usage`". On this machine it holds `dailyActivity[]` with `date`, `messageCount`, `sessionCount`, `toolCallCount`, plus `totalSessions` and `firstSessionDate`. That shape is not documented. Sources: [Manage sessions](https://code.claude.com/docs/en/sessions), [Explore the .claude directory](https://code.claude.com/docs/en/claude-directory).

**No API and no command.** The docs list no CLI command and no API that reports sessions per day. `/usage` is interactive. The Agent SDK and `claude -p --output-format json` report the cost of one run, not history. OpenTelemetry export exists but needs a collector, which is a backend. Sources: [Commands](https://code.claude.com/docs/en/commands), [Monitoring](https://code.claude.com/docs/en/monitoring-usage), [Run Claude Code programmatically](https://code.claude.com/docs/en/headless).

**Retention.** Claude Code deletes transcripts older than `cleanupPeriodDays`, default 30 days. On this machine transcripts go back 59 days and `history.jsonl` goes back to 2026-05-18, so the sweep is not strict, but the job must not depend on that. The job reads the previous `activity.json`, adds the days it can see, and keeps the older days as they were. The committed JSON is the ledger. Sources: [Data usage](https://code.claude.com/docs/en/data-usage), [settings reference, cleanupPeriodDays](https://code.claude.com/docs/en/settings-reference).

**Sessions or active days.** A count of transcript files overstates sessions. On 2026-08-26 there are 39 transcripts but 18 distinct `sessionId` values in `history.jsonl`. Subagents, forks, background runs, and `claude -p` runs each get a transcript with no typed prompt. Count a session as a distinct `sessionId` in `history.jsonl` with at least one typed prompt. That is "sessions where I typed a prompt". Compute the streak on active days, since a day with one session and a day with thirty are both one day of work. Show the per-day session count in the cell and the streak in days. Cross-check against `stats-cache.json` `dailyActivity[].sessionCount` in the first weeks and log both numbers.

**Timezone.** `history.jsonl` timestamps are UTC. Convert to `Europe/Copenhagen` before the day key, the same rule as the Build Log.

**Privacy.** The job reads `history.jsonl`, which holds prompts and project paths. Only integers per day leave the machine. No project name, path, prompt, or session id goes into the JSON. The script never reads transcript bodies.

### C. The job

**Node, not Claude.** The job is a Node script, `scripts/activity.mjs`, that runs `gh api graphql` through `child_process` or calls `https://api.github.com/graphql` with `fetch` and the token in the header. It reads two local files, writes one JSON file, and runs `git`. None of that needs a model. Claude Code headless (`claude -p`) would add API cost per run, needs `ANTHROPIC_API_KEY` in bare mode, and gives a nondeterministic result for a deterministic task. It is not needed. Source: [Run Claude Code programmatically](https://code.claude.com/docs/en/headless).

**Tokens.** The script gets tokens at runtime from `gh auth token --user <login>`. Nothing is written to the repo. `gh` stores tokens in Windows Credential Manager. A scheduled task that runs "whether the user is logged on or not" with a stored password (`/ru` and `/rp`) loads the user profile, so Credential Manager is readable. A task created with `/np` (no password) runs without the profile and `gh` may fail to read the keyring. Store the password. If that is not acceptable, put the two tokens in user-scope environment variables and have the script read `process.env`. Either way, the script must never print tokens and the JSON must never contain a login of the work account.

**Own clone.** The task runs in a dedicated clone, for example `%LOCALAPPDATA%\portfolio-activity\`, not in Emil's working tree. It runs `git pull --rebase` first, writes the file, commits only when the content changed, and pushes. This keeps bot commits away from Emil's uncommitted work and away from feature branches.

**Schedule.** `schtasks` shape:

```
schtasks /create /tn "portfolio-activity" /sc daily /st 07:00 /ri 720 /du 24:00 ^
  /tr "\"C:\Program Files\nodejs\node.exe\" \"%LOCALAPPDATA%\portfolio-activity\scripts\activity.mjs\"" ^
  /ru %USERNAME% /rp * /rl LIMITED /f
```

`/ri 720 /du 24:00` repeats every 12 hours. `/rp *` prompts for the password once. Without `/it` the task runs whether the user is logged on or not.

`schtasks` has no flag for "run task as soon as possible after a scheduled start is missed". PowerShell has it:

```powershell
$a = New-ScheduledTaskAction -Execute "C:\Program Files\nodejs\node.exe" -Argument "$env:LOCALAPPDATA\portfolio-activity\scripts\activity.mjs"
$t = New-ScheduledTaskTrigger -Daily -At 07:00
$t.Repetition = (New-ScheduledTaskTrigger -Once -At 07:00 -RepetitionInterval (New-TimeSpan -Hours 12)).Repetition
$s = New-ScheduledTaskSettingsSet -StartWhenAvailable -RunOnlyIfNetworkAvailable -ExecutionTimeLimit (New-TimeSpan -Minutes 10)
Register-ScheduledTask -TaskName "portfolio-activity" -Action $a -Trigger $t -Settings $s -User $env:USERNAME -Password (Read-Host "password") -RunLevel Limited
```

`-StartWhenAvailable` means "Task Scheduler can start the task at any time after its scheduled time has passed". `-WakeToRun` exists but wakes a laptop in a bag. Do not set it. Sources: [schtasks create](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/schtasks-create), [New-ScheduledTaskSettingsSet](https://learn.microsoft.com/en-us/powershell/module/scheduledtasks/new-scheduledtasksettingsset).

**The sleep gotcha.** A task cannot run while the machine is asleep or off. "Twice a day" degrades to "at the next wake after 07:00 and 19:00". Some days get zero runs. The site must show it. Render `generatedAt` as "Updated 2 September 2026" next to the grid. When `generatedAt` is older than three days, add the line "The last update ran on <date>. The job runs on my machine, not on a server." That sentence is Testimony that keeps the number honest.

### D. The write path

**Bot commits on `main`.** One or two commits per day with the subject `activity: 2026-09-02 07:00`. Consequences and fixes:

- The Build Log reads `git log --no-merges`. Add `--invert-grep --grep='^activity: '` so the bot never appears. Git documents `--invert-grep` as "Limit the commits output to ones with a log message that do not match the pattern specified with `--grep`". Use the subject prefix as the filter key. Also set `git -c user.name="activity-bot" -c user.email="activity-bot@users.noreply.github.com"` on the commit, so `--author` works as a second filter and the GitHub history shows the bot as a separate author. The prefix is the primary key because a rebase keeps the subject. Source: [git log](https://git-scm.com/docs/git-log).
- The commit walk (section A) drops commits whose `messageHeadline` starts with `activity: `. The bot then never inflates the calendar.
- Cloudflare Pages Free plan allows 500 builds per month and one build at a time. Two bot builds per day is about 62 per month. Normal work adds a few per day. The total stays under 500 with room. A run that finds no change makes no commit and no build. Source: [Pages limits](https://developers.cloudflare.com/pages/platform/limits/).
- Cloudflare skips a build when the subject starts with `[CI Skip]`. Do not use it here. The whole point of the commit is the deploy. Source: [GitHub integration](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/).

**Alternative: a data branch and a runtime fetch.** The job pushes `activity.json` to a branch `activity-data`. The site fetches `https://raw.githubusercontent.com/emkataumre/portfolio/activity-data/activity.json` at load. A probe shows the raw host returns `Access-Control-Allow-Origin: *` and `Cache-Control: max-age=300` on a plain GET. An OPTIONS preflight returns 403, but a plain `fetch()` with no custom header sends no preflight, so this works. The REST contents endpoint also sends `Access-Control-Allow-Origin: *`, with a 60 requests per hour limit per IP for unauthenticated calls, so raw is the better host. Benefits: no bot commits on `main`, no builds, no Build Log filter. Costs: a network request on every page view, an empty state until it resolves, a dependency on GitHub at view time, and a JSON file that is not in the deployed artifact. Source: [Using CORS](https://docs.github.com/en/rest/using-the-rest-api/using-cors-and-jsonp-to-make-cross-origin-requests), plus `curl -I` probes on 2026-09-02.

**Pick the `main` commit.** The site stays fully static. The number on the page is the number in the repository at that commit, which a Reader can verify. The two filters are one line each. Keep the branch option in reserve if the bot commits become a nuisance in the GitHub history view.

### E. Data shape

One file, `src/activity/activity.json`, committed. About 3 KB.

```ts
type Activity = {
  generatedAt: string;          // ISO 8601 UTC, when the job ran
  timeZone: "Europe/Copenhagen";
  days: { from: string; to: string };  // "YYYY-MM-DD", inclusive, 365 days
  commits: number[];            // 365 ints, index 0 is `from`, both accounts merged
  sessions: number[];           // 365 ints, Claude Code sessions with a typed prompt
  streak: { days: number; endsOn: string };  // consecutive days with sessions >= 1
  counters: {
    since: string;              // "YYYY-MM-DD", first day of the walk
    commits: number;
    linesAdded: number;
    linesRemoved: number;
    pullRequestsMerged: number;
    issuesOpenedNowClosed: number;
    repositories: number;
    claudeSessions: number;
    claudeActiveDays: number;
  };
};
```

Rules:

- Two flat integer arrays keyed by `days.from`. No per-day objects, no per-account split, no repository names, no logins.
- The 7 and 30 day views are slices of the same array in the browser.
- `sessions` for days older than the local files come from the previous `activity.json`. The script reads the old file first.
- `counters.since` is the start of the 365 day window for commits and lines. Show it on the page: "since 3 September 2025".
- The React page imports the JSON. Vite bundles it. No runtime fetch.

## Recommendation

1. Write `scripts/activity.mjs`. Steps: read the previous JSON, walk both accounts with `history(author:{id}, since:)` per repository, run the two searches per account, read `history.jsonl` for sessions per day, merge, write, commit with `activity: <date>` when changed, push.
2. Register the task through PowerShell with `-StartWhenAvailable`, a stored password, and a 10 minute time limit. Run it in a dedicated clone.
3. Add `--invert-grep --grep='^activity: '` to `scripts/build-log.mjs`.
4. Show `generatedAt` next to the grids and the stale line after three days.
5. Show the counters with the labels from the table in section A. Do not show a contribution calendar total.

## Open points

- The cause of the missing private commits in `contributionsCollection` on the org account. It does not block the plan, since the walk does not use that field. Emil can look at his profile graph with "Private contributions" on to see whether GitHub shows them there.
- Whether the search index returns issues and pull requests from the private org repositories for the work token. Run `search(type: ISSUE, query: "author:<login> is:pr is:merged")` once with the work token and compare against the repository view.
- `git push` from the task uses the `gh` credential helper and the active account. If Emil has switched the active account to a work login at that moment, the push to the personal repository fails. The script can set `GH_TOKEN` to the personal token before `git push`, or the task can run `gh auth switch --user emkataumre` first. Verify which one the credential helper honours.
- Whether to show lines at all. The number is exact but says little. Decide from the prototype.
- The day boundary for commits: `authoredDate` matches the Build Log, `committedDate` matches what GitHub shows. This note picks `authoredDate`.
