import test from 'ava'
import notDeepMerge from 'not-deep-merge'
import { each } from 'test-each'

each(
  [
    { firstValue: {}, secondValue: {}, result: {} },
    { firstValue: { aa: 1 }, secondValue: { bb: 2 }, result: { aa: 1, bb: 2 } },
    { firstValue: { aa: 1 }, secondValue: { aa: 2 }, result: { aa: 2 } },
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
  ],
  ({ title }, { firstValue, secondValue, result }) => {
    test(`notDeepMerge() result | ${title}`, (t) => {
      t.deepEqual(notDeepMerge(firstValue, secondValue), result)
    })
  },
)
