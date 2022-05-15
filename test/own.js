import test from 'ava'
import partialMerge from 'partial-merge'
import { each } from 'test-each'

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
