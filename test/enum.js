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

// This also test that both arguments' plain objects are deeply cloned
each(
  [
    { first: {}, second: { aa: nonEnumObj } },
    { first: { aa: nonEnumObj }, second: {} },
  ],
  ({ title }, { first, second }) => {
    test(`Non-enumerable properties are not kept in result | ${title}`, (t) => {
      t.false('nonEnum' in notDeepMerge(first, second).aa)
    })
  },
)

each(
  [
    { first: { aa: 1, nonEnum: 2 }, second: nonEnumObj },
    { first: nonEnumObj, second: { aa: 1, nonEnum: 2 } },
  ],
  ({ title }, { first, second }) => {
    test(`Non-enumerable properties are ignored even if overridden | ${title}`, (t) => {
      t.is(notDeepMerge(first, second).nonEnum, 2)
    })
  },
)
