import test from 'ava'
import notDeepMerge from 'not-deep-merge'
import { each } from 'test-each'

each(
  [
    { first: true, second: { aa: 1 } },
    { first: { aa: 1 }, second: true },
    { first: false, second: true },
    { first: [1], second: [2] },
    { first: { aa: 1 }, second: [2] },
    { first: [1], second: { aa: 1 } },
  ],
  ({ title }, { first, second }) => {
    test(`Non-objects are kept as is | ${title}`, (t) => {
      t.deepEqual(notDeepMerge(first, second), second)
    })
  },
)
