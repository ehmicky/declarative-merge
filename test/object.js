import test from 'ava'
import notDeepMerge from 'not-deep-merge'
import { each } from 'test-each'

each(
  [
    { firstValue: { aa: 1 }, secondValue: { bb: 2 }, result: { aa: 1, bb: 2 } },
    {
      firstValue: { cc: { aa: 1 } },
      secondValue: { cc: { bb: 2 } },
      result: { cc: { aa: 1, bb: 2 } },
    },
    { firstValue: { aa: 1 }, secondValue: { aa: 2 }, result: { aa: 2 } },
    {
      firstValue: { cc: { aa: 1 } },
      secondValue: { cc: { aa: 2 } },
      result: { cc: { aa: 2 } },
    },
    { firstValue: {}, secondValue: {}, result: {} },
  ],
  ({ title }, { firstValue, secondValue, result }) => {
    test(`Objects are deeply merged | ${title}`, (t) => {
      t.deepEqual(notDeepMerge(firstValue, secondValue), result)
    })
  },
)
