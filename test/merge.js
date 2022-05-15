/* eslint-disable max-lines */
import test from 'ava'
import partialMerge from 'partial-merge'
import { each } from 'test-each'

each(
  [
    { first: { aa: 1 }, second: { bb: 2, _merge: true }, result: { bb: 2 } },
    {
      first: { cc: { aa: 1 }, dd: { aa: 1 } },
      second: { cc: { bb: 2, _merge: true }, dd: { bb: 2 } },
      result: { cc: { bb: 2 }, dd: { aa: 1, bb: 2 } },
    },
    {
      first: { cc: { aa: 1 } },
      second: { cc: { bb: 2 }, _merge: true },
      result: { cc: { bb: 2 } },
    },
    {
      first: { aa: 1 },
      second: { bb: 2, _merge: false },
      result: { aa: 1, bb: 2 },
    },
    {
      first: { aa: 1 },
      second: { bb: 2, _merge: undefined },
      result: { aa: 1, bb: 2, _merge: undefined },
    },
    {
      first: { aa: 1 },
      second: { bb: 2, _merge: 3 },
      result: { aa: 1, bb: 2, _merge: 3 },
    },
    {
      first: { cc: { dd: { aa: 1 }, ff: 1 }, ee: 1 },
      second: {
        cc: { dd: { bb: 2, _merge: true }, _merge: false },
        _merge: true,
      },
      result: { cc: { dd: { bb: 2 }, ff: 1 } },
    },
    {
      first: { cc: { dd: { aa: 1 }, ff: 0 }, ee: 1 },
      second: {
        cc: { dd: { bb: 2, _merge: true }, _merge: true },
        _merge: true,
      },
      result: { cc: { dd: { bb: 2 } } },
    },
    {
      first: { cc: { dd: { aa: 1 }, ff: 2 }, ee: 1 },
      second: {
        cc: { dd: { bb: 2, _merge: false }, _merge: false },
        _merge: false,
      },
      result: { cc: { dd: { aa: 1, bb: 2 }, ff: 2 }, ee: 1 },
    },
    {
      first: { cc: [1], aa: 3 },
      second: { cc: { 1: 2 }, bb: 2, _merge: true },
      result: { cc: [1, 2], bb: 2 },
    },
    {
      first: { cc: [{ aa: 1 }] },
      second: { cc: { 0: { bb: 2 } }, _merge: true },
      result: { cc: [{ bb: 2 }] },
    },
    {
      first: { cc: [{ aa: 1 }] },
      second: { cc: { 0: { bb: 1 } }, _merge: false },
      result: { cc: [{ aa: 1, bb: 1 }] },
    },
    {
      first: { cc: [{ aa: 1 }] },
      second: { cc: { 0: { bb: 2 }, _merge: true } },
      result: { cc: [{ bb: 2 }] },
    },
    {
      first: { cc: [{ aa: 1 }, { aa: 1 }] },
      second: {
        cc: { 0: { bb: 2, _merge: true }, 1: { bb: 2, _merge: false } },
      },
      result: { cc: [{ bb: 2 }, { aa: 1, bb: 2 }] },
    },
    {
      first: { cc: { aa: 1 }, dd: 1 },
      // eslint-disable-next-line unicorn/no-null
      second: { cc: { bb: 2 }, ee: 2, _merge: null },
      result: { cc: { bb: 2 }, dd: 1, ee: 2 },
    },
  ],
  ({ title }, { first, second, result }) => {
    test(`Objects with _merge: true are not merged | ${title}`, (t) => {
      t.deepEqual(partialMerge(first, second), result)
    })
  },
)
/* eslint-enable max-lines */
