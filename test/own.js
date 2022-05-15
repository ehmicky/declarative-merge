import test from 'ava'
import notDeepMerge from 'not-deep-merge'

test.serial(`Inherited properties are ignored in plain objects`, (t) => {
  // eslint-disable-next-line no-extend-native, fp/no-mutation
  Object.prototype.nonOwn = 1
  const secondValue = { bb: 1 }
  t.is(secondValue.nonOwn, 1)
  const result = notDeepMerge({}, secondValue)
  t.is(result.nonOwn, 1)
  // eslint-disable-next-line fp/no-delete
  delete Object.prototype.nonOwn
  t.false('nonOwn' in result)
})

test(`Inherited properties are kept in other objects as part of the prototype`, (t) => {
  const prototype = { nonOwn: 1 }
  const secondValue = { bb: 1, __proto__: prototype }
  t.is(secondValue.nonOwn, 1)
  const result = notDeepMerge({}, secondValue)
  t.is(result.nonOwn, 1)
  // eslint-disable-next-line fp/no-delete
  delete prototype.nonOwn
  t.false('nonOwn' in result)
})
