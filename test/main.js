import test from 'ava'
import notDeepMerge from 'not-deep-merge'
import { each } from 'test-each'

each(
  [{ firstValue: {}, secondValue: {}, result: {} }],
  ({ title }, { firstValue, secondValue, result }) => {
    test(`notDeepMerge() result | ${title}`, (t) => {
      t.deepEqual(notDeepMerge(firstValue, secondValue), result)
    })
  },
)
