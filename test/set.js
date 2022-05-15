import test from 'ava'
import partialMerge from 'partial-merge'
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
    {
      first: { cc: { dd: { aa: 1 }, ff: 1 }, ee: 1 },
      second: { cc: { dd: { bb: 2, _set: true }, _set: false }, _set: true },
      result: { cc: { dd: { bb: 2 }, ff: 1 } },
    },
    {
      first: { cc: { dd: { aa: 1 }, ff: 0 }, ee: 1 },
      second: { cc: { dd: { bb: 2, _set: true }, _set: true }, _set: true },
      result: { cc: { dd: { bb: 2 } } },
    },
    {
      first: { cc: { dd: { aa: 1 }, ff: 2 }, ee: 1 },
      second: { cc: { dd: { bb: 2, _set: false }, _set: false }, _set: false },
      result: { cc: { dd: { aa: 1, bb: 2 }, ff: 2 }, ee: 1 },
    },
    {
      first: { cc: [1], aa: 3 },
      second: { cc: { 1: 2 }, bb: 2, _set: true },
      result: { cc: [1, 2], bb: 2 },
    },
    {
      first: { cc: [{ aa: 1 }] },
      second: { cc: { 0: { bb: 2 } }, _set: true },
      result: { cc: [{ bb: 2 }] },
    },
    {
      first: { cc: [{ aa: 1 }] },
      second: { cc: { 0: { bb: 1 } }, _set: false },
      result: { cc: [{ aa: 1, bb: 1 }] },
    },
    {
      first: { cc: [{ aa: 1 }] },
      second: { cc: { 0: { bb: 2 }, _set: true } },
      result: { cc: [{ bb: 2 }] },
    },
    {
      first: { cc: [{ aa: 1 }, { aa: 1 }] },
      second: { cc: { 0: { bb: 2, _set: true }, 1: { bb: 2, _set: false } } },
      result: { cc: [{ bb: 2 }, { aa: 1, bb: 2 }] },
    },
    {
      first: { cc: { aa: 1 }, dd: 1 },
      // eslint-disable-next-line unicorn/no-null
      second: { cc: { bb: 2 }, ee: 2, _set: null },
      result: { cc: { bb: 2 }, dd: 1, ee: 2 },
    },
  ],
  ({ title }, { first, second, result }) => {
    test(`Objects with _set: true are not merged | ${title}`, (t) => {
      t.deepEqual(partialMerge(first, second), result)
    })
  },
)
