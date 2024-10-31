/* eslint-disable no-underscore-dangle, @typescript-eslint/naming-convention */
import { expectAssignable, expectNotAssignable, expectType } from 'tsd'

import declarativeMerge, { type Options } from 'declarative-merge'

const firstValue = { a: 1 }
expectType<typeof firstValue>(declarativeMerge(firstValue, {}))

const keySymbol = Symbol('key')
declarativeMerge({ a: 1 }, {})
declarativeMerge({ a: 1 }, { a: 2 })
declarativeMerge({ b: { a: 1 } }, { b: { a: 2 } })
declarativeMerge({ a: 1 }, { a: 2, _merge: 'deep' })
declarativeMerge({ a: 1 }, { a: 2, _merge: 'shallow' })
declarativeMerge({ a: 1 }, { a: 2, _merge: 'set' })
declarativeMerge({ a: 1 }, { a: 2, _merge: 'delete' })
declarativeMerge({ a: 1, _merge: 1 }, { a: 2, _merge: 'set' })
declarativeMerge({ b: { a: 1 } }, { b: { a: 2, _merge: 'set' } })
expectType<number>(declarativeMerge({ a: 1, _merge: 2 }, {})._merge)

expectType<number>(declarativeMerge({ a: 1, b: { _merge: 2 } }, {}).b._merge)
declarativeMerge({ a: [1] }, {})
declarativeMerge({ a: [1] }, { a: [2] })
declarativeMerge({ a: [1] }, { a: {} })
declarativeMerge({ a: [1] }, { a: { '1': 2 } })
declarativeMerge({ a: [1] }, { a: { '1': [2] } })
declarativeMerge({ a: [{ b: 1 }] }, { a: { '0': { b: 2, _merge: 'set' } } })
declarativeMerge(
  { a: [[{ b: 1 }]] },
  { a: { '0': { '0': { b: 2, _merge: 'set' } } } },
)
declarativeMerge([1], {})
declarativeMerge([1], { '0': 2 })
declarativeMerge({}, {}, {})
declarativeMerge({}, {}, { key: 'key' })
declarativeMerge({}, {}, { key: keySymbol })
declarativeMerge({}, { key: 'deep' }, { key: 'key' })
declarativeMerge({ key: 2 }, { key: 'deep' }, { key: 'key' })
declarativeMerge({ a: [{}] }, { a: [{ key: 'deep' }] }, { key: 'key' })
declarativeMerge(
  { a: [{}] },
  { a: [{ [keySymbol]: 'deep' }] },
  { key: keySymbol },
)
declarativeMerge({ _merge: 2 }, { _merge: 2 }, { key: 'key' })

expectAssignable<Options>({})
expectNotAssignable<Options>(true)
// @ts-expect-error
declarativeMerge({}, {}, true)
expectNotAssignable<Options>({ unknownOption: true })
// @ts-expect-error
declarativeMerge({}, {}, { unknownOption: true })
expectNotAssignable<Options>({ key: 0 })
// @ts-expect-error
declarativeMerge({}, {}, { key: 0 })

// @ts-expect-error
declarativeMerge({ a: 1 }, { b: 2 })
// @ts-expect-error
declarativeMerge({ c: { a: 1 } }, { c: { b: 2 } })
// @ts-expect-error
declarativeMerge({ a: [1] }, { a: [true] })
// @ts-expect-error
declarativeMerge({ a: [1] }, { a: { '1': true } })
// @ts-expect-error
declarativeMerge({ a: 1 }, { a: 2, _merge: 2 })
// @ts-expect-error
declarativeMerge({ a: 1, _merge: 1 }, { a: 2, _merge: 2 })
// @ts-expect-error
declarativeMerge({}, { key: 2 }, { key: 'key' })
// @ts-expect-error
declarativeMerge({ a: [{}] }, { a: [{ key: 2 }] }, { key: 'key' })

declarativeMerge(
  { a: [{}] },
  // @ts-expect-error
  { a: [{ [keySymbol]: 2 }] },
  { [keySymbol]: 'key' },
)
/* eslint-enable no-underscore-dangle, @typescript-eslint/naming-convention */
