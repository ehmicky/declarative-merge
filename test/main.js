import test from 'ava'
import notDeepMerge from 'not-deep-merge'
import { each } from 'test-each'

each(
  [
    {
      firstValue: { aa: 1 },
      secondValue: { bb: 2 },
      result: { aa: 1, bb: 2 },
    },
    {
      firstValue: { aa: 1 },
      secondValue: { aa: 2 },
      result: { aa: 2 },
    },
    {
      firstValue: { aa: { bb: 1 } },
      secondValue: { aa: { bb: 2 } },
      result: { aa: { bb: 2 } },
    },
    {
      firstValue: { aa: { bb: 1 } },
      secondValue: { aa: { cc: 2 } },
      result: { aa: { bb: 1, cc: 2 } },
    },
    {
      firstValue: {},
      secondValue: {},
      result: {},
    },
    {
      firstValue: true,
      secondValue: { aa: 1 },
      result: { aa: 1 },
    },
    {
      firstValue: { aa: 1 },
      secondValue: true,
      result: true,
    },
    {
      firstValue: false,
      secondValue: true,
      result: true,
    },
    {
      firstValue: [1],
      secondValue: [2],
      result: [2],
    },
    {
      firstValue: { aa: 1 },
      secondValue: [2],
      result: [2],
    },
    {
      firstValue: [1],
      secondValue: { aa: 1 },
      result: { aa: 1 },
    },
  ],
  ({ title }, { firstValue, secondValue, result }) => {
    test(`notDeepMerge() result | ${title}`, (t) => {
      t.deepEqual(notDeepMerge(firstValue, secondValue), result)
    })
  },
)
