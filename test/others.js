import test from 'ava'
import notDeepMerge from 'not-deep-merge'
import { each } from 'test-each'

each(
  [
    { firstValue: true, secondValue: { aa: 1 } },
    { firstValue: { aa: 1 }, secondValue: true },
    { firstValue: false, secondValue: true },
    { firstValue: [1], secondValue: [2] },
    { firstValue: { aa: 1 }, secondValue: [2] },
    { firstValue: [1], secondValue: { aa: 1 } },
  ],
  ({ title }, { firstValue, secondValue }) => {
    test(`Non-objects are kept as is | ${title}`, (t) => {
      t.deepEqual(notDeepMerge(firstValue, secondValue), secondValue)
    })
  },
)
