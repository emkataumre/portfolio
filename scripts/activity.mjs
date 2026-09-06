// Activity data collector. Run by hand, or from the scheduled job.
// Reads GitHub through `gh api graphql` for both accounts, and reads the local
// Claude Code prompt history at ~/.claude/history.jsonl. Writes
// src/activity/activity.json. Only integers leave the machine: no login, no
// repository name, no project path, no prompt text, no session id, no token.
// The script fails loud. Any GitHub call that does not recover after the
// retries stops the run: it prints one line, exits non-zero, and writes no
// file. The output is a committed ledger that a scheduled job deploys, so a
// partial walk would publish a number that is too low. The previous file stays
// in place instead.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ACCOUNTS = ['emkataumre', 'emil-the-second'];
const TIME_ZONE = 'Europe/Copenhagen';
const WINDOW_DAYS = 365;
const BOT_PREFIX = 'activity: ';
const RETRY_DELAYS_MS = [1000, 2000, 4000, 8000];
const NETWORK_FAILURE =
  /\b(?:HTTP 5\d{2}|EOF|ECONNRESET|ECONNREFUSED|ETIMEDOUT|EAI_AGAIN|ENOTFOUND)\b|timeout|TLS handshake|dial tcp|connection reset|no such host|Bad Gateway|Service Unavailable|Gateway Time-?out/i;

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = resolve(rootDir, 'src/activity/activity.json');
const historyPath = resolve(homedir(), '.claude/history.jsonl');

const dayFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const REPOS_QUERY = `query($cursor: String) {
  viewer {
    id
    repositoriesContributedTo(first: 100, contributionTypes: [COMMIT], includeUserRepositories: true, after: $cursor) {
      pageInfo { hasNextPage endCursor }
      nodes { id name owner { login } }
    }
  }
}`;

const HISTORY_QUERY = `query($owner: String!, $name: String!, $authorId: ID!, $since: GitTimestamp!, $cursor: String) {
  repository(owner: $owner, name: $name) {
    defaultBranchRef {
      target {
        ... on Commit {
          history(author: {id: $authorId}, since: $since, first: 100, after: $cursor) {
            pageInfo { hasNextPage endCursor }
            nodes { authoredDate additions deletions messageHeadline }
          }
        }
      }
    }
  }
}`;

const SEARCH_QUERY = `query($q: String!) { search(type: ISSUE, query: $q) { issueCount } }`;

// Returns the calendar day of a date in the activity time zone.
export function dayOf(date) {
  return dayFormat.format(date);
}

// Returns the 365 day keys of the window that ends on the given day.
export function windowDays(lastDay) {
  const end = Date.parse(`${lastDay}T12:00:00Z`);
  const days = [];
  for (let i = WINDOW_DAYS - 1; i >= 0; i -= 1) {
    days.push(new Date(end - i * 86400000).toISOString().slice(0, 10));
  }
  return days;
}

// Reports whether a commit belongs to the activity bot.
export function isBotCommit(messageHeadline) {
  return typeof messageHeadline === 'string' && messageHeadline.startsWith(BOT_PREFIX);
}

// Parses history.jsonl into a map from day to the set of session ids that
// carry at least one typed prompt. Malformed lines are skipped.
export function parseSessionHistory(text) {
  const byDay = new Map();
  for (const line of text.split('\n')) {
    if (line.trim() === '') continue;
    let record;
    try {
      record = JSON.parse(line);
    } catch {
      continue;
    }
    if (typeof record?.display !== 'string' || record.display.trim() === '') continue;
    if (!Number.isFinite(record.timestamp) || typeof record.sessionId !== 'string') continue;
    const day = dayOf(new Date(record.timestamp));
    if (!byDay.has(day)) byDay.set(day, new Set());
    byDay.get(day).add(record.sessionId);
  }
  return byDay;
}

// Maps a previous file back to its day keys. A file that holds counts but
// names no last day is a fault, not an empty file: the counts are real and no
// day key can carry them. The run stops rather than drop them.
function previousByDay(previous, values) {
  const byDay = new Map();
  if (values === undefined || values === null) return byDay;
  if (!Array.isArray(values) || typeof previous?.days?.to !== 'string') {
    throw new Error('the previous activity.json holds sessions but no days.to, so no day can carry forward');
  }
  for (const [index, day] of windowDays(previous.days.to).entries()) {
    const count = values[index];
    if (Number.isInteger(count)) byDay.set(day, count);
  }
  return byDay;
}

// Builds the session counts for the window. Each day takes the larger of the
// local count and the previous count. The local Claude Code history is the
// only copy of that data and it is swept after 30 days, so a day the sweep
// already emptied must never overwrite the value the ledger holds. A day count
// only ever grows while the day runs, so the larger value is the true one.
export function mergeSessions(days, byDay, previous) {
  const carried = previousByDay(previous, previous?.sessions);
  return days.map((day) => Math.max(byDay.get(day)?.size ?? 0, carried.get(day) ?? 0));
}

// Returns the run of consecutive active days that ends today or yesterday, and
// the last active day of the window. A gap of two days or more gives 0 days.
// A window with no active day at all gives a null last day.
export function computeStreak(days, sessions) {
  let last = null;
  for (const [index, day] of days.entries()) {
    if (sessions[index] > 0) last = day;
  }
  let end = sessions.length - 1;
  if (sessions[end] === 0) end -= 1;
  let count = 0;
  for (let i = end; i >= 0 && sessions[i] > 0; i -= 1) count += 1;
  return { days: count, endsOn: last };
}

// Reduces an activity object to the measurements it carries: the per day
// counts under their own day keys, the streak, and the counters. The stamp and
// the window edges roll with the calendar on their own, so they stay out.
export function measurements(activity) {
  if (typeof activity?.days?.to !== 'string') return null;
  const days = windowDays(activity.days.to);
  const keyed = (values) =>
    days.map((day, index) => [day, values?.[index] ?? 0]).filter(([, count]) => count > 0);
  const { since: _since, ...counters } = activity.counters ?? {};
  return JSON.stringify({
    commits: keyed(activity.commits),
    sessions: keyed(activity.sessions),
    streak: activity.streak ?? null,
    counters: Object.entries(counters).sort(([a], [b]) => (a < b ? -1 : 1)),
  });
}

// Reports whether two activity objects hold the same measurements.
export function sameNumbers(a, b) {
  const left = measurements(a);
  return left !== null && left === measurements(b);
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function readToken(login) {
  try {
    return execFileSync('gh', ['auth', 'token', '--user', login], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    throw new Error('gh auth token failed for one of the accounts');
  }
}

// Runs one GraphQL query through gh. Retries network and 5xx failures only.
function graphql(token, query, variables, label) {
  const body = JSON.stringify({ query, variables });
  for (let attempt = 0; ; attempt += 1) {
    let stdout = '';
    let stderr = '';
    try {
      stdout = execFileSync('gh', ['api', 'graphql', '--input', '-'], {
        encoding: 'utf8',
        input: body,
        env: { ...process.env, GH_TOKEN: token, GH_HOST: 'github.com' },
        stdio: ['pipe', 'pipe', 'pipe'],
        maxBuffer: 32 * 1024 * 1024,
      });
    } catch (error) {
      stdout = String(error.stdout ?? '');
      stderr = String(error.stderr ?? error.message ?? '');
    }
    let parsed;
    try {
      parsed = JSON.parse(stdout);
    } catch {
      parsed = null;
    }
    if (parsed?.data && !parsed.errors) return parsed.data;
    const reason = parsed?.errors?.[0]?.message ?? stderr.trim().split('\n')[0] ?? 'unknown';
    const retryable = !parsed?.errors && NETWORK_FAILURE.test(stderr);
    if (!retryable || attempt >= RETRY_DELAYS_MS.length) {
      throw new Error(`${label} failed: ${reason}`);
    }
    sleep(RETRY_DELAYS_MS[attempt]);
  }
}

// Lists the repositories one account has committed to, with the viewer id.
function listRepositories(token, label) {
  const repositories = [];
  let viewerId = null;
  let cursor = null;
  for (;;) {
    const data = graphql(token, REPOS_QUERY, { cursor }, `${label} repository list`);
    const page = data.viewer.repositoriesContributedTo;
    viewerId = data.viewer.id;
    repositories.push(...page.nodes.filter(Boolean));
    if (!page.pageInfo.hasNextPage) break;
    cursor = page.pageInfo.endCursor;
  }
  return { viewerId, repositories };
}

// Walks the default branch of one repository and returns the author's commits.
function walkRepository(token, repository, viewerId, since, label) {
  const commits = [];
  let cursor = null;
  for (;;) {
    const data = graphql(
      token,
      HISTORY_QUERY,
      {
        owner: repository.owner.login,
        name: repository.name,
        authorId: viewerId,
        since,
        cursor,
      },
      `${label} commit walk`,
    );
    const history = data.repository?.defaultBranchRef?.target?.history;
    if (!history) break;
    commits.push(...history.nodes.filter(Boolean));
    if (!history.pageInfo.hasNextPage) break;
    cursor = history.pageInfo.endCursor;
  }
  return commits;
}

// Collects the GitHub side of the window for every account.
function collectGitHub(days) {
  const from = days[0];
  const to = days[days.length - 1];
  // One day earlier than the window, so that a commit late in the day before
  // still lands inside the window after the time zone shift. The day filter
  // below drops anything outside the window.
  const since = new Date(Date.parse(`${from}T00:00:00Z`) - 86400000).toISOString();
  const perDay = new Map(days.map((day) => [day, 0]));
  const repositoryIds = new Set();
  let linesAdded = 0;
  let linesRemoved = 0;
  let pullRequestsMerged = 0;
  let issuesOpenedNowClosed = 0;

  for (const [index, login] of ACCOUNTS.entries()) {
    const label = `account ${index + 1}`;
    const token = readToken(login);
    const { viewerId, repositories } = listRepositories(token, label);
    for (const repository of repositories) {
      let counted = false;
      for (const commit of walkRepository(token, repository, viewerId, since, label)) {
        if (isBotCommit(commit.messageHeadline)) continue;
        const day = dayOf(new Date(commit.authoredDate));
        if (day < from || day > to) continue;
        perDay.set(day, perDay.get(day) + 1);
        linesAdded += commit.additions ?? 0;
        linesRemoved += commit.deletions ?? 0;
        counted = true;
      }
      if (counted) repositoryIds.add(repository.id);
    }
    pullRequestsMerged += graphql(
      token,
      SEARCH_QUERY,
      { q: `author:${login} is:pr is:merged merged:>=${from}` },
      `${label} pull request search`,
    ).search.issueCount;
    issuesOpenedNowClosed += graphql(
      token,
      SEARCH_QUERY,
      { q: `author:${login} is:issue is:closed closed:>=${from}` },
      `${label} issue search`,
    ).search.issueCount;
  }

  return {
    commits: days.map((day) => perDay.get(day)),
    linesAdded,
    linesRemoved,
    pullRequestsMerged,
    issuesOpenedNowClosed,
    repositories: repositoryIds.size,
  };
}

// Reads the previous file. A file that exists but does not parse stops the
// run: the sessions it holds are the only copy of that data, so the script
// must never write a new file over a file it could not read.
function readPrevious() {
  if (!existsSync(outputPath)) return null;
  try {
    return JSON.parse(readFileSync(outputPath, 'utf8'));
  } catch {
    throw new Error('the previous activity.json does not parse, so the session history cannot carry forward');
  }
}

function readSessionHistory() {
  if (!existsSync(historyPath)) return new Map();
  return parseSessionHistory(readFileSync(historyPath, 'utf8'));
}

export function main() {
  const days = windowDays(dayOf(new Date()));
  const from = days[0];
  const to = days[days.length - 1];
  const previous = readPrevious();
  const sessions = mergeSessions(days, readSessionHistory(), previous);
  const github = collectGitHub(days);
  const activity = {
    generatedAt: new Date().toISOString(),
    timeZone: TIME_ZONE,
    days: { from, to },
    commits: github.commits,
    sessions,
    streak: computeStreak(days, sessions),
    counters: {
      since: from,
      commits: github.commits.reduce((sum, n) => sum + n, 0),
      linesAdded: github.linesAdded,
      linesRemoved: github.linesRemoved,
      pullRequestsMerged: github.pullRequestsMerged,
      issuesOpenedNowClosed: github.issuesOpenedNowClosed,
      repositories: github.repositories,
      claudeSessions: sessions.reduce((sum, n) => sum + n, 0),
      claudeActiveDays: sessions.filter((n) => n > 0).length,
    },
  };
  if (sameNumbers(activity, previous)) {
    console.log(`activity: unchanged since ${previous.generatedAt}`);
    return;
  }
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, JSON.stringify(activity, null, 2) + '\n');
  console.log(
    `activity: ${from} to ${to} commits=${activity.counters.commits} sessions=${activity.counters.claudeSessions} repositories=${activity.counters.repositories}`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    main();
  } catch (error) {
    console.error(`activity: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}
