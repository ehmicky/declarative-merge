import test from 'ava'
import notDeepMerge from 'not-deep-merge'
import { each } from 'test-each'

each(
  [
    { first: { aa: 1 }, second: { bb: 2, _set: true }, result: { bb: 2 } },
    {
      first: { cc: { aa: 1 }, dd: { aa: 1 } },
      second: { cc: { bb: 2, _set: true }, dd: { bb: 2 } },
      result: { cc: { bb: 2 }, dd: { aa: 1, bb: 2 } },
    },
    {
      first: { cc: { aa: 1 } },
      second: { cc: { bb: 2 }, _set: true },
      result: { cc: { bb: 2 } },
    },
    {
      first: { aa: 1 },
      second: { bb: 2, _set: false },
      result: { aa: 1, bb: 2 },
    },
    {
      first: { aa: 1 },
      second: { bb: 2, _set: undefined },
      result: { aa: 1, bb: 2, _set: undefined },
    },
    {
      first: { aa: 1 },
      second: { bb: 2, _set: 3 },
      result: { aa: 1, bb: 2, _set: 3 },
    },
  ],
  ({ title }, { first, second, result }) => {
    test(`Objects with _set: true are not merged | ${title}`, (t) => {
      t.deepEqual(notDeepMerge(first, second), result)
    })
  },
)
