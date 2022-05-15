import test from 'ava'
import notDeepMerge from 'not-deep-merge'
import { each } from 'test-each'

const getNotEnumObj = function () {
  const object = { enum: 1 }
  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(object, 'notEnum', { value: 1, enumerable: false })
  return object
}

const notEnumObj = getNotEnumObj()

// This also test that both arguments' plain objects are deeply cloned
each(
  [
    { first: {}, second: { aa: notEnumObj } },
    { first: { aa: notEnumObj }, second: {} },
  ],
  ({ title }, { first, second }) => {
    test(`Non-enumerable properties are not kept in result | ${title}`, (t) => {
      t.false('notEnum' in notDeepMerge(first, second).aa)
    })
  },
)

each(
  [
    { first: { aa: 1, notEnum: 2 }, second: notEnumObj },
    { first: notEnumObj, second: { aa: 1, notEnum: 2 } },
  ],
  ({ title }, { first, second }) => {
    test(`Non-enumerable properties are ignored even if overridden | ${title}`, (t) => {
      t.is(notDeepMerge(first, second).notEnum, 2)
    })
  },
)
