import test from 'ava'
import notDeepMerge from 'not-deep-merge'
import { each } from 'test-each'

each(
  [
    { first: { aa: 1 }, second: { bb: 2 }, result: { aa: 1, bb: 2 } },
    {
      first: { cc: { aa: 1 } },
      second: { cc: { bb: 2 } },
      result: { cc: { aa: 1, bb: 2 } },
    },
    { first: { aa: 1 }, second: { aa: 2 }, result: { aa: 2 } },
    {
      first: { cc: { aa: 1 } },
      second: { cc: { aa: 2 } },
      result: { cc: { aa: 2 } },
    },
    { first: {}, second: {}, result: {} },
    {
      first: { [Symbol.for('aa')]: 1 },
      second: { [Symbol.for('bb')]: 2 },
      result: { [Symbol.for('aa')]: 1, [Symbol.for('bb')]: 2 },
    },
    {
      first: { [Symbol.for('cc')]: { aa: 1 } },
      second: { [Symbol.for('cc')]: { bb: 2 } },
      result: { [Symbol.for('cc')]: { aa: 1, bb: 2 } },
    },
  ],
  ({ title }, { first, second, result }) => {
    test(`Objects are deeply merged | ${title}`, (t) => {
      t.deepEqual(notDeepMerge(first, second), result)
    })
  },
)
