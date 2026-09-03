// Build Log generator. Runs as the npm prebuild script.
// Reads git history and build-log/annotations.md, then writes
// src/build-log/build-log.json. Never fails the build.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const REPO_URL = 'https://github.com/emkataumre/portfolio';
const TIME_ZONE = 'Europe/Copenhagen';
export const LOG_ARGS = [
  'log',
  '--no-merges',
  '--invert-grep',
  '--grep=^activity: ',
  '--name-only',
  '--pretty=format:%x1e%H%x1f%h%x1f%aI%x1f%s%x1f%b%x1d',
];

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const annotationsPath = resolve(rootDir, 'build-log/annotations.md');
const outputPath = resolve(rootDir, 'src/build-log/build-log.json');

const dayFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

function git(args) {
  return execFileSync('git', args, {
    cwd: rootDir,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim();
}

// Returns the calendar day of an ISO date in the build time zone.
export function dayOf(isoDate) {
  return dayFormat.format(new Date(isoDate));
}

// Removes the trailing block of "Word: value" lines from a commit body.
// Lines without that prefix, such as "Closes #20", stay.
export function stripTrailers(body) {
  const lines = body.replace(/\r\n/g, '\n').trimEnd().split('\n');
  while (lines.length > 0) {
    const last = lines[lines.length - 1];
    if (last.trim() === '' || /^[A-Za-z-]+: /.test(last)) {
      lines.pop();
    } else {
      break;
    }
  }
  return lines.join('\n').trim();
}

// Parses the raw output of the git log command into commit objects.
export function parseGitLog(raw) {
  return raw
    .split('\x1e')
    .filter((record) => record.includes('\x1d'))
    .map((record) => {
      const [head, names] = record.split('\x1d');
      const [sha, shortSha, date, subject, body] = head.split('\x1f');
      const filesChanged = names
        .split('\n')
        .filter((line) => line.trim() !== '').length;
      return {
        sha,
        shortSha,
        date,
        subject,
        body: stripTrailers(body ?? ''),
        filesChanged,
      };
    });
}

// Parses annotations.md into a map from day to note.
export function parseAnnotations(text) {
  const notes = new Map();
  const sections = text.replace(/\r\n/g, '\n').split(/^## (\d{4}-\d{2}-\d{2})\s*$/m);
  for (let i = 1; i < sections.length; i += 2) {
    const note = sections[i + 1].trim();
    if (note !== '') notes.set(sections[i], note);
  }
  return notes;
}

// Groups commits by day, merges the notes, and sorts newest first.
export function buildDays(commits, notes) {
  const byDay = new Map();
  for (const commit of commits) {
    const day = dayOf(commit.date);
    if (!byDay.has(day)) byDay.set(day, []);
    byDay.get(day).push(commit);
  }
  for (const day of notes.keys()) {
    if (!byDay.has(day)) byDay.set(day, []);
  }
  return [...byDay.keys()]
    .sort()
    .reverse()
    .map((day) => ({
      day,
      note: notes.get(day) ?? null,
      commits: byDay
        .get(day)
        .slice()
        .sort((a, b) => Date.parse(b.date) - Date.parse(a.date)),
    }));
}

function readAnnotations() {
  try {
    return parseAnnotations(readFileSync(annotationsPath, 'utf8'));
  } catch {
    return new Map();
  }
}

function unshallow() {
  try {
    if (git(['rev-parse', '--is-shallow-repository']) === 'true') {
      git(['fetch', '--unshallow']);
    }
  } catch {
    // The build continues with the history that is present.
  }
}

function readHistory() {
  unshallow();
  const commits = parseGitLog(git(LOG_ARGS));
  if (commits.length === 0) throw new Error('git log returned no commits');
  return { commits, headSha: git(['rev-parse', 'HEAD']) };
}

function writeLog(target, log) {
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(
    target,
    JSON.stringify(
      { generatedAt: new Date().toISOString(), repoUrl: REPO_URL, ...log },
      null,
      2,
    ) + '\n',
  );
}

function oneLine(text) {
  return text.replace(/\s+/g, ' ').trim();
}

// Writes the Build Log JSON to target. Exits 0 in every case.
export function main(target = outputPath) {
  const notes = readAnnotations();
  let log;
  let status;
  try {
    const { commits, headSha } = readHistory();
    log = { source: 'git', headSha, days: buildDays(commits, notes) };
    status = `build-log: source=git commits=${commits.length}`;
  } catch (error) {
    log = {
      source: 'fallback',
      headSha: process.env.CF_PAGES_COMMIT_SHA || null,
      days: buildDays([], notes),
    };
    status = `build-log: source=fallback reason=${oneLine(error.message)}`;
  }
  try {
    writeLog(target, log);
  } catch (error) {
    status = `build-log: source=fallback reason=${oneLine(error.message)}`;
  }
  console.log(status);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main(process.env.BUILD_LOG_OUT || undefined);
}
