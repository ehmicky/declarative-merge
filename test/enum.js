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
    { firstValue: {}, secondValue: { aa: nonEnumObj } },
    { firstValue: { aa: nonEnumObj }, secondValue: {} },
  ],
  ({ title }, { firstValue, secondValue }) => {
    test(`Non-enumerable properties are not kept in result | ${title}`, (t) => {
      t.false('nonEnum' in notDeepMerge(firstValue, secondValue).aa)
    })
  },
)

each(
  [
    { firstValue: { aa: 1, nonEnum: 2 }, secondValue: nonEnumObj },
    { firstValue: nonEnumObj, secondValue: { aa: 1, nonEnum: 2 } },
  ],
  ({ title }, { firstValue, secondValue }) => {
    test(`Non-enumerable properties are ignored even if overridden | ${title}`, (t) => {
      t.is(notDeepMerge(firstValue, secondValue).nonEnum, 2)
    })
  },
)
