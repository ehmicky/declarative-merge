import test from 'ava'
import partialMerge from 'partial-merge'
import { each } from 'test-each'

each(
  [
    {
      first: { aa: 1, bb: 2, cc: 3 },
      // eslint-disable-next-line unicorn/no-null
      second: { aa: undefined, bb: null },
      // eslint-disable-next-line unicorn/no-null
      result: { aa: undefined, bb: null, cc: 3 },
    },
    {
      first: { aa: 1 },
      second: { bb: 2, _merge: 'delete' },
      result: undefined,
    },
    {
      first: { cc: { aa: 1 }, dd: 1 },
      second: { cc: { bb: 2, _merge: 'delete' }, ee: 2 },
      result: { dd: 1, ee: 2 },
    },
    {
      first: { aa: 1 },
      second: { bb: { _merge: 'deep' }, _merge: 'delete' },
      result: undefined,
    },
    { first: [1, 2, 3], second: { 1: { _merge: 'delete' } }, result: [1, 3] },
    {
      first: [1, 2, 3],
      second: { 1: { _merge: 'delete' }, 2: 0 },
      result: [1, 0],
    },
  ],
  ({ title }, { first, second, result }) => {
    test(`Objects can use _merge: delete | ${title}`, (t) => {
      t.deepEqual(partialMerge(first, second), result)
    })
  },
)
