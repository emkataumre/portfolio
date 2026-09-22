import assert from 'node:assert/strict'
import test from 'node:test'
import { mergeCommits, walkRepository, windowDays } from './activity.mjs'

test('walkRepository includes branch commits once across refs', () => {
  const mainCommit = { oid: 'main', authoredDate: '2026-09-22T10:00:00Z' }
  const branchCommit = { oid: 'branch', authoredDate: '2026-09-22T12:00:00Z' }
  const query = (_token, _document, variables) => {
    if (variables.ref) {
      assert.equal(variables.ref, 'refs/heads/work')
      assert.equal(variables.cursor, 'more-commits')
      return { repository: { ref: { target: { history: { pageInfo: { hasNextPage: false }, nodes: [branchCommit] } } } } }
    }
    return {
      repository: {
        refs: {
          pageInfo: variables.cursor
            ? { hasNextPage: false }
            : { hasNextPage: true, endCursor: 'more-refs' },
          nodes: variables.cursor
            ? [{ name: 'work', target: { history: { pageInfo: { hasNextPage: true, endCursor: 'more-commits' }, nodes: [mainCommit] } } }]
            : [{ name: 'main', target: { history: { pageInfo: { hasNextPage: false }, nodes: [mainCommit] } } }],
        },
      },
    }
  }

  const commits = walkRepository('', { owner: { login: 'owner' }, name: 'repo' }, 'author', '2026-09-21T00:00:00Z', 'test', query)
  assert.deepEqual(commits.map((commit) => commit.oid), ['main', 'branch'])
})

test('mergeCommits preserves historical counts when a repository is deleted', () => {
  const previousDays = windowDays('2026-09-13')
  const days = windowDays('2026-09-14')
  const previousCommits = previousDays.map(() => 0)
  const collectedCommits = days.map(() => 0)

  previousCommits[0] = 9
  previousCommits[previousDays.indexOf('2026-05-26')] = 14
  previousCommits[previousDays.indexOf('2026-09-08')] = 3
  collectedCommits[days.indexOf('2026-09-08')] = 5
  collectedCommits[days.indexOf('2026-09-14')] = 15

  const merged = mergeCommits(days, collectedCommits, {
    days: { from: previousDays[0], to: previousDays.at(-1) },
    commits: previousCommits,
    counters: { since: previousDays[0] },
  })

  assert.equal(merged[days.indexOf('2026-05-26')], 14)
  assert.equal(merged[days.indexOf('2026-09-08')], 5)
  assert.equal(merged[days.indexOf('2026-09-14')], 15)
  assert.equal(merged.reduce((sum, count) => sum + count, 0), 34)
  assert.equal(merged.length, 365)
})
