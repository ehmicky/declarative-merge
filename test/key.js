import test from 'ava'
import partialMerge from 'partial-merge'
import { each } from 'test-each'

const KEY_SYM = Symbol('_merge')

each(
  [
    {
      key: 'kk',
      first: { aa: 1 },
      second: { bb: 2, kk: 'none' },
      result: { bb: 2 },
    },
    {
      key: 'kk',
      first: { aa: 1 },
      second: { bb: 2, _merge: 'none' },
      result: { aa: 1, bb: 2, _merge: 'none' },
    },
    {
      key: 'kk',
      first: { cc: { aa: 1 } },
      second: { cc: { bb: 2, kk: 'none' } },
      result: { cc: { bb: 2 } },
    },
    {
      key: 'kk',
      first: { aa: 1, kk: 'none' },
      second: { bb: 2 },
      result: { aa: 1, kk: 'none', bb: 2 },
    },
    {
      key: KEY_SYM,
      first: { aa: 1 },
      second: { bb: 2, [KEY_SYM]: 'none' },
      result: { bb: 2 },
    },
  ],
  ({ title }, { key, first, second, result }) => {
    test(`The "key" option changes the merge key | ${title}`, (t) => {
      t.deepEqual(partialMerge(first, second, { key }), result)
    })
  },
)
