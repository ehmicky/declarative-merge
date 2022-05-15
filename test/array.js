import test from 'ava'
import partialMerge from 'partial-merge'
import { each } from 'test-each'

each(
  [
    { first: [1], second: [2], result: [2] },
    { first: [{ aa: 1 }], second: [{ aa: 2 }], result: [{ aa: 2 }] },
    { first: [1], second: {}, result: [1] },
    { first: [1], second: { 1: 3, aa: 2 }, result: { 1: 3, aa: 2 } },
    { first: undefined, second: {}, result: {} },
    { first: undefined, second: { aa: 1 }, result: { aa: 1 } },
    { first: true, second: {}, result: {} },
    { first: true, second: { aa: 1 }, result: { aa: 1 } },
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
      t.deepEqual(partialMerge(first, second), result)
    })
  },
)
