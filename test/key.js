import test from 'ava'
import partialMerge from 'partial-merge'
import { each } from 'test-each'

const KEY_SYM = Symbol('_merge')

each(
  [
    {
      key: 'kk',
      first: { aa: 1 },
      second: { bb: 2, kk: 'set' },
      result: { bb: 2 },
    },
    {
      key: 'kk',
      first: { aa: 1 },
      second: { bb: 2, _merge: 'set' },
      result: { aa: 1, bb: 2, _merge: 'set' },
    },
    {
      key: 'kk',
      first: { cc: { aa: 1 } },
      second: { cc: { bb: 2, kk: 'set' } },
      result: { cc: { bb: 2 } },
    },
    {
      key: 'kk',
      first: { aa: 1, kk: 'set' },
      second: { bb: 2 },
      result: { aa: 1, kk: 'set', bb: 2 },
    },
    {
      key: KEY_SYM,
      first: { aa: 1 },
      second: { bb: 2, [KEY_SYM]: 'set' },
      result: { bb: 2 },
    },
  ],
  ({ title }, { key, first, second, result }) => {
    test(`The "key" option changes the merge key | ${title}`, (t) => {
      t.deepEqual(partialMerge(first, second, { key }), result)
    })
  },
)
