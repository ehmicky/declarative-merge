import test from 'ava'
import partialMerge from 'partial-merge'
import { each } from 'test-each'

// eslint-disable-next-line fp/no-mutating-methods
const notEnumObj = Object.defineProperty({}, 'notEnum', { value: 1 })
const notEnumSym = Symbol('notEnum')
// eslint-disable-next-line fp/no-mutating-methods
const notEnumSymObj = Object.defineProperty({}, notEnumSym, { value: 1 })

// This also test that both arguments' plain objects are deeply cloned
each(
  [
    { first: {}, second: { aa: notEnumObj } },
    { first: { aa: notEnumObj }, second: {} },
    { first: {}, second: { aa: notEnumObj, _merge: 'none' } },
  ],
  ({ title }, { first, second }) => {
    test(`Non-enumerable properties are not kept in result | ${title}`, (t) => {
      t.false('notEnum' in partialMerge(first, second).aa)
    })
  },
)

each(
  [
    { first: {}, second: { [notEnumSym]: notEnumSymObj } },
    { first: { [notEnumSym]: notEnumSymObj }, second: {} },
  ],
  ({ title }, { first, second }) => {
    test(`Non-enumerable symbols are not kept in result | ${title}`, (t) => {
      t.false(notEnumSym in partialMerge(first, second)[notEnumSym])
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
      t.is(partialMerge(first, second).notEnum, 2)
    })
  },
)

each([Object.prototype, {}], ({ title }, prototype) => {
  test.serial(
    `Inherited properties are ignored in plain objects | ${title}`,
    (t) => {
      // eslint-disable-next-line fp/no-mutation, no-param-reassign
      prototype.notOwn = 1
      const second = { aa: 1, __proto__: prototype }
      t.is(second.notOwn, 1)
      const result = partialMerge({}, second)
      t.is(result.notOwn, 1)
      // eslint-disable-next-line fp/no-delete, no-param-reassign
      delete prototype.notOwn
      t.false('notOwn' in result)
    },
  )
})
