import test from 'ava'
import declarativeMerge from 'declarative-merge'
import { each } from 'test-each'


const KEY_SYM = Symbol('_merge')

each(
  [
    { first: { aa: 1 }, second: { bb: 2, _merge: 'set' }, result: { bb: 2 } },
    {
      first: { cc: { aa: 1 }, dd: { aa: 1 } },
      second: { cc: { bb: 2, _merge: 'set' }, dd: { bb: 2 } },
      result: { cc: { bb: 2 }, dd: { aa: 1, bb: 2 } },
    },
    {
      first: { cc: { aa: 1 } },
      second: { cc: { bb: 2 }, _merge: 'set' },
      result: { cc: { bb: 2 } },
    },
    {
      first: { aa: 1 },
      second: { bb: 2, _merge: 'deep' },
      result: { aa: 1, bb: 2 },
    },
    {
      first: { aa: 1 },
      second: { bb: 2, _merge: undefined },
      result: { aa: 1, bb: 2 },
    },
    {
      first: { aa: 1, _merge: 3 },
      second: { bb: 2 },
      result: { aa: 1, bb: 2, _merge: 3 },
    },
    {
      first: { aa: 1, _merge: 3 },
      second: { bb: 2, _merge: 'deep' },
      result: { aa: 1, bb: 2, _merge: 3 },
    },
    {
      first: { cc: { dd: { aa: 1 }, ff: 1 }, ee: 1 },
      second: {
        cc: { dd: { bb: 2, _merge: 'set' }, _merge: 'deep' },
        _merge: 'set',
      },
      result: { cc: { dd: { bb: 2 }, ff: 1 } },
    },
    {
      first: { cc: { dd: { aa: 1 }, ff: 0 }, ee: 1 },
      second: {
        cc: { dd: { bb: 2, _merge: 'set' }, _merge: 'set' },
        _merge: 'set',
      },
      result: { cc: { dd: { bb: 2 } } },
    },
    {
      first: { cc: { dd: { aa: 1 }, ff: 2 }, ee: 1 },
      second: {
        cc: { dd: { bb: 2, _merge: 'deep' }, _merge: 'deep' },
        _merge: 'deep',
      },
      result: { cc: { dd: { aa: 1, bb: 2 }, ff: 2 }, ee: 1 },
    },
    {
      first: { cc: [1], aa: 3 },
      second: { cc: { 1: 2 }, bb: 2, _merge: 'set' },
      result: { cc: [1, 2], bb: 2 },
    },
    {
      first: { cc: [{ aa: 1 }] },
      second: { cc: { 0: { bb: 2 } }, _merge: 'set' },
      result: { cc: [{ bb: 2 }] },
    },
    {
      first: { cc: [{ aa: 1 }] },
      second: { cc: { 0: { bb: 0 }, _merge: undefined }, _merge: 'set' },
      result: { cc: [{ bb: 0 }] },
    },
    {
      first: { cc: [{ aa: 1 }] },
      second: { cc: { 0: { bb: 1 } }, _merge: 'deep' },
      result: { cc: [{ aa: 1, bb: 1 }] },
    },
    {
      first: { cc: [{ aa: 1 }] },
      second: { cc: { 0: { bb: 2 }, _merge: 'set' } },
      result: { cc: [{ bb: 2 }] },
    },
    {
      first: { cc: [{ aa: 1 }, { aa: 1 }] },
      second: {
        cc: { 0: { bb: 2, _merge: 'set' }, 1: { bb: 2, _merge: 'deep' } },
      },
      result: { cc: [{ bb: 2 }, { aa: 1, bb: 2 }] },
    },
    {
      first: { cc: { aa: 1 }, dd: 1 },
      second: { cc: { bb: 2 }, ee: 2, _merge: 'shallow' },
      result: { cc: { bb: 2 }, dd: 1, ee: 2 },
    },
  ],
  ({ title }, { first, second, result }) => {
    test(`Objects can set the _merge mode | ${title}`, (t) => {
      t.deepEqual(declarativeMerge(first, second), result)
    })
  },
)

test('Invalid _merge value throws', (t) => {
  t.throws(() => declarativeMerge({}, { _merge: true }))
})

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
      t.deepEqual(declarativeMerge(first, second, { key }), result)
    })
  },
)

test('The "key" option is validated', (t) => {
  t.throws(() => declarativeMerge({}, {}, { key: 1 }))
})
