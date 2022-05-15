import test from 'ava'
import notDeepMerge from 'not-deep-merge'

test.serial(`Inherited properties are ignored in plain objects`, (t) => {
  // eslint-disable-next-line no-extend-native, fp/no-mutation
  Object.prototype.notOwn = 1
  const second = { aa: 1 }
  t.is(second.notOwn, 1)
  const result = notDeepMerge({}, second)
  t.is(result.notOwn, 1)
  // eslint-disable-next-line fp/no-delete
  delete Object.prototype.notOwn
  t.false('notOwn' in result)
})

test(`Inherited properties are kept in other objects as part of the prototype`, (t) => {
  const prototype = { notOwn: 1 }
  const second = { aa: 1, __proto__: prototype }
  t.is(second.notOwn, 1)
  const result = notDeepMerge({}, second)
  t.is(result.notOwn, 1)
  // eslint-disable-next-line fp/no-delete
  delete prototype.notOwn
  t.false('notOwn' in result)
})
