/* eslint-disable max-lines */
import test from 'ava'
import partialMerge from 'partial-merge'
import { each } from 'test-each'

each(
  [
    { first: { aa: 1 }, second: { bb: 2, _merge: 'none' }, result: { bb: 2 } },
    {
      first: { cc: { aa: 1 }, dd: { aa: 1 } },
      second: { cc: { bb: 2, _merge: 'none' }, dd: { bb: 2 } },
      result: { cc: { bb: 2 }, dd: { aa: 1, bb: 2 } },
    },
    {
      first: { cc: { aa: 1 } },
      second: { cc: { bb: 2 }, _merge: 'none' },
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
      first: { aa: 1 },
      second: { bb: 2, _merge: 3 },
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
        cc: { dd: { bb: 2, _merge: 'none' }, _merge: 'deep' },
        _merge: 'none',
      },
      result: { cc: { dd: { bb: 2 }, ff: 1 } },
    },
    {
      first: { cc: { dd: { aa: 1 }, ff: 0 }, ee: 1 },
      second: {
        cc: { dd: { bb: 2, _merge: 'none' }, _merge: 'none' },
        _merge: 'none',
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
      second: { cc: { 1: 2 }, bb: 2, _merge: 'none' },
      result: { cc: [1, 2], bb: 2 },
    },
    {
      first: { cc: [{ aa: 1 }] },
      second: { cc: { 0: { bb: 2 } }, _merge: 'none' },
      result: { cc: [{ bb: 2 }] },
    },
    {
      first: { cc: [{ aa: 1 }] },
      second: { cc: { 0: { bb: 0 }, _merge: undefined }, _merge: 'none' },
      result: { cc: [{ bb: 0 }] },
    },
    {
      first: { cc: [{ aa: 1 }] },
      second: { cc: { 0: { bb: 1 } }, _merge: 'deep' },
      result: { cc: [{ aa: 1, bb: 1 }] },
    },
    {
      first: { cc: [{ aa: 1 }] },
      second: { cc: { 0: { bb: 2 }, _merge: 'none' } },
      result: { cc: [{ bb: 2 }] },
    },
    {
      first: { cc: [{ aa: 1 }, { aa: 1 }] },
      second: {
        cc: { 0: { bb: 2, _merge: 'none' }, 1: { bb: 2, _merge: 'deep' } },
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
      t.deepEqual(partialMerge(first, second), result)
    })
  },
)
/* eslint-enable max-lines */
