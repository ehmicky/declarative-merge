import test from 'ava'
import notDeepMerge from 'not-deep-merge'
import { each } from 'test-each'

const getNonEnumObj = function () {
  const object = { enum: 1 }
  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(object, 'nonEnum', { value: 1, enumerable: false })
  return object
}

const nonEnumObj = getNonEnumObj()

each(
  [
    {
      firstValue: { aa: 1 },
      secondValue: nonEnumObj,
      result: { aa: 1, enum: 1 },
    },
    {
      firstValue: nonEnumObj,
      secondValue: { aa: 1 },
      result: { aa: 1, enum: 1 },
    },
    {
      firstValue: { aa: 1, nonEnum: 2 },
      secondValue: nonEnumObj,
      result: { aa: 1, enum: 1, nonEnum: 2 },
    },
    {
      firstValue: nonEnumObj,
      secondValue: { aa: 1, nonEnum: 2 },
      result: { aa: 1, enum: 1, nonEnum: 2 },
    },
    {
      firstValue: {},
      secondValue: { aa: nonEnumObj },
      result: { aa: { enum: 1 } },
    },
  ],
  ({ title }, { firstValue, secondValue, result }) => {
    test(`Non-enumerable properties are ignored | ${title}`, (t) => {
      t.deepEqual(notDeepMerge(firstValue, secondValue), result)
    })
  },
)
