import test from 'ava'
import notDeepMerge from 'not-deep-merge'
import { each } from 'test-each'

// eslint-disable-next-line fp/no-mutating-methods
const notEnumObj = Object.defineProperty({}, 'notEnum', { value: 1 })

// This also test that both arguments' plain objects are deeply cloned
each(
  [
    { first: {}, second: { aa: notEnumObj } },
    { first: { aa: notEnumObj }, second: {} },
    { first: {}, second: { aa: notEnumObj, _set: true } },
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
