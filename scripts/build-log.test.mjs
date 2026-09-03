// Run with: npm run test:build-log
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import {
  LOG_ARGS,
  buildDays,
  dayOf,
  parseAnnotations,
  parseGitLog,
  stripTrailers,
} from './build-log.mjs';

const record = (sha, date, subject, body, files) =>
  `\x1e${sha}\x1f${sha.slice(0, 7)}\x1f${date}\x1f${subject}\x1f${body}\x1d\n${files.join('\n')}\n\n`;

test('parseGitLog reads fields, strips trailers, counts files', () => {
  const raw =
    record('a'.repeat(40), '2026-09-03T12:20:30+02:00', 'Subject A',
      'Prose line.\n\nCloses #20\n\nCo-Authored-By: X <x@y>\nClaude-Session: https://z\n', ['src/a.ts']) +
    record('b'.repeat(40), '2026-09-02T23:30:00+02:00', 'Subject B', '', ['src/b.ts', 'src/c.ts']);
  const commits = parseGitLog(raw);
  assert.equal(commits.length, 2);
  assert.deepEqual(commits[0], {
    sha: 'a'.repeat(40),
    shortSha: 'aaaaaaa',
    date: '2026-09-03T12:20:30+02:00',
    subject: 'Subject A',
    body: 'Prose line.\n\nCloses #20',
    filesChanged: 1,
  });
  assert.equal(commits[1].body, '');
  assert.equal(commits[1].filesChanged, 2);
});

test('parseGitLog returns no commits for empty output', () => {
  assert.deepEqual(parseGitLog(''), []);
});

test('stripTrailers keeps a body with no trailers', () => {
  assert.equal(stripTrailers('Only prose.\n'), 'Only prose.');
});

test('dayOf uses the Copenhagen calendar day', () => {
  assert.equal(dayOf('2026-09-02T23:30:00+02:00'), '2026-09-02');
  assert.equal(dayOf('2026-09-02T22:30:00Z'), '2026-09-03');
});

test('parseAnnotations maps headings to notes', () => {
  const notes = parseAnnotations(
    '# Build Log annotations\n\n## 2026-09-02\n\nPlanning day.\n\n## 2026-09-04\n\nSecond note.\n',
  );
  assert.deepEqual([...notes], [
    ['2026-09-02', 'Planning day.'],
    ['2026-09-04', 'Second note.'],
  ]);
});

test('buildDays groups by day, merges notes, sorts newest first', () => {
  const commits = [
    { sha: '1', date: '2026-09-02T10:00:00+02:00' },
    { sha: '2', date: '2026-09-03T09:00:00+02:00' },
    { sha: '3', date: '2026-09-02T12:00:00+02:00' },
  ];
  const notes = new Map([['2026-09-01', 'Note only day.']]);
  const days = buildDays(commits, notes);
  assert.deepEqual(days.map((d) => d.day), ['2026-09-03', '2026-09-02', '2026-09-01']);
  assert.deepEqual(days[1].commits.map((c) => c.sha), ['3', '1']);
  assert.equal(days[1].note, null);
  assert.deepEqual(days[2], { day: '2026-09-01', note: 'Note only day.', commits: [] });
});

test('buildDays sorts commits by instant, not by ISO string', () => {
  const commits = [
    { sha: 'early', date: '2026-09-03T09:00:00+02:00' },
    { sha: 'late', date: '2026-09-03T08:00:00Z' },
  ];
  assert.deepEqual(buildDays(commits, new Map())[0].commits.map((c) => c.sha), ['late', 'early']);
});

test('git log filter drops activity commits', () => {
  const dir = mkdtempSync(join(tmpdir(), 'build-log-'));
  const run = (...args) =>
    execFileSync('git', args, { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  run('init', '-q');
  run('-c', 'user.name=t', '-c', 'user.email=t@t', 'commit', '-q', '--allow-empty', '-m', 'Real work');
  run('-c', 'user.name=t', '-c', 'user.email=t@t', 'commit', '-q', '--allow-empty', '-m', 'activity: 2026-09-03');
  const raw = run(...LOG_ARGS);
  assert.deepEqual(parseGitLog(raw).map((c) => c.subject), ['Real work']);
});

test('main falls back and exits 0 when git is not usable', () => {
  const script = resolve(import.meta.dirname, 'build-log.mjs');
  const target = join(mkdtempSync(join(tmpdir(), 'build-log-')), 'out', 'build-log.json');
  const out = execFileSync(process.execPath, [script], {
    encoding: 'utf8',
    env: { ...process.env, PATH: '', CF_PAGES_COMMIT_SHA: 'cafe1234', BUILD_LOG_OUT: target },
  });
  assert.match(out, /^build-log: source=fallback reason=.+\n$/);
  const json = JSON.parse(readFileSync(target, 'utf8'));
  assert.equal(json.source, 'fallback');
  assert.equal(json.headSha, 'cafe1234');
  assert.equal(json.days.length, 1);
  assert.equal(json.days[0].day, '2026-09-02');
  assert.deepEqual(json.days[0].commits, []);
});
