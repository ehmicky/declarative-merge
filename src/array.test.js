import test from 'ava'
import declarativeMerge from 'declarative-merge'
import { each } from 'test-each'

const symbolKey = Symbol('key')
each(
  [
    { first: [1], second: [2], result: [2] },
    { first: [{ aa: 1 }], second: [{ aa: 2 }], result: [{ aa: 2 }] },
    ...['aa', symbolKey].map((key) => ({
      first: [1],
      second: { 1: 3, [key]: 2 },
      result: { 1: 3, [key]: 2 },
    })),
    ...[undefined, true, [1]].map((first) => ({
      first,
      second: {},
      result: {},
    })),
    ...[undefined, true, {}, { bb: 2 }].map((first) => ({
      first,
      second: { 0: 3 },
      result: [3],
    })),
    {
      first: {},
      second: { aa: [{ bb: { 0: 1 } }] },
      result: { aa: [{ bb: [1] }] },
    },
    {
      first: { aa: [1], bb: 2 },
      second: { aa: { 0: 3 } },
      result: { aa: [3], bb: 2 },
    },
    { first: [1, 2, 3], second: { 1: 0 }, result: [1, 0, 3] },
    { first: [1, 2, 3], second: { 1: 0, 2: 0 }, result: [1, 0, 0] },
    { first: [1, 2, 3], second: { '1+': 0 }, result: [1, 0, 2, 3] },
    { first: [1, 2, 3], second: { '-1': 0 }, result: [1, 2, 0] },
    { first: [1, 2, 3], second: { '-0': 0 }, result: [1, 2, 3, 0] },
    { first: [1, 2, 3], second: { 3: 0 }, result: [1, 2, 3, 0] },
    { first: [1, 2, 3], second: { '-0+': 0 }, result: [1, 2, 3, 0] },
    { first: [1, 2, 3], second: { '-10': 0 }, result: [0, 2, 3] },
    { first: [1, 2, 3], second: { 1: [0, -1] }, result: [1, 0, -1, 3] },
    { first: [1, 2, 3], second: { 1: [] }, result: [1, 3] },
    { first: [1, 2, 3], second: { 1: [[0]] }, result: [1, [0], 3] },
  ],
  ({ title }, { first, second, result }) => {
    test(`Arrays can be patched | ${title}`, (t) => {
      t.deepEqual(declarativeMerge(first, second), result)
    })
  },
)
