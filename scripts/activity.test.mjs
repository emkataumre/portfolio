import assert from 'node:assert/strict'
import test from 'node:test'
import { mergeCommits, windowDays } from './activity.mjs'

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
