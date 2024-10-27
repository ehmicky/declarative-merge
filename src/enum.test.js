import test from 'ava'
import { each } from 'test-each'

import declarativeMerge from 'declarative-merge'

const notEnumObj = Object.defineProperty({}, 'notEnum', { value: 1 })
const notEnumSym = Symbol('notEnum')
const notEnumSymObj = Object.defineProperty({}, notEnumSym, { value: 1 })

// This also test that both arguments' plain objects are deeply cloned
each(
  [
    { first: {}, second: { aa: [notEnumObj] } },
    { first: { aa: [notEnumObj] }, second: {} },
  ],
  ({ title }, { first, second }) => {
    test(`Non-enumerable properties are not kept in result | ${title}`, (t) => {
      t.false('notEnum' in declarativeMerge(first, second).aa[0])
    })
  },
)

test('_merge property is removed from second argument', (t) => {
  t.false('_merge' in declarativeMerge({}, { aa: [{ _merge: 'deep' }] }).aa[0])
})

test('_merge property is resolved from second argument', (t) => {
  t.is(declarativeMerge({}, { aa: [{ _merge: 'delete' }] }).aa.length, 0)
})

test('_merge property is not removed from first argument', (t) => {
  t.true('_merge' in declarativeMerge({ aa: [{ _merge: 'deep' }] }, {}).aa[0])
})

each(
  [
    { first: {}, second: { [notEnumSym]: notEnumSymObj } },
    { first: { [notEnumSym]: notEnumSymObj }, second: {} },
  ],
  ({ title }, { first, second }) => {
    test(`Non-enumerable symbols are not kept in result | ${title}`, (t) => {
      t.false(notEnumSym in declarativeMerge(first, second)[notEnumSym])
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
      t.is(declarativeMerge(first, second).notEnum, 2)
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
      const result = declarativeMerge({}, second)
      t.is(result.notOwn, 1)
      // eslint-disable-next-line fp/no-delete, no-param-reassign
      delete prototype.notOwn
      t.false('notOwn' in result)
    },
  )
})
