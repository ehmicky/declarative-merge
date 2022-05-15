import partialMerge from 'partial-merge'
import { expectType, expectError } from 'tsd'

const firstValue = { a: 1 }
expectType<typeof firstValue>(partialMerge(firstValue, {}))

const keySymbol = Symbol('key')
partialMerge({ a: 1 }, {})
partialMerge({ a: 1 }, { a: 2 })
partialMerge({ b: { a: 1 } }, { b: { a: 2 } })
partialMerge({ a: 1 }, { a: 2, _merge: 'none' })
partialMerge({ a: 1 }, { a: 2, _merge: 'shallow' })
partialMerge({ a: 1 }, { a: 2, _merge: 'deep' })
partialMerge({ a: 1, _merge: 1 }, { a: 2, _merge: 'none' })
partialMerge({ b: { a: 1 } }, { b: { a: 2, _merge: 'none' } })
expectType<number>(partialMerge({ a: 1, _merge: 2 }, {})._merge)
expectType<number>(partialMerge({ a: 1, b: { _merge: 2 } }, {}).b._merge)
partialMerge({ a: [1] }, {})
partialMerge({ a: [1] }, { a: [2] })
partialMerge({ a: [1] }, { a: {} })
partialMerge({ a: [1] }, { a: { '1': 2 } })
partialMerge({ a: [1] }, { a: { '1': [2] } })
partialMerge({ a: [{ b: 1 }] }, { a: { '0': { b: 2, _merge: 'none' } } })
partialMerge(
  { a: [[{ b: 1 }]] },
  { a: { '0': { '0': { b: 2, _merge: 'none' } } } },
)
partialMerge([1], {})
partialMerge([1], { '0': 2 })
partialMerge({}, {}, {})
partialMerge({}, {}, { key: 'key' })
partialMerge({}, {}, { key: keySymbol })
partialMerge({}, { key: 'deep' }, { key: 'key' })
partialMerge({ key: 2 }, { key: 'deep' }, { key: 'key' })
partialMerge({ a: [{}] }, { a: [{ key: 'deep' }] }, { key: 'key' })
partialMerge({ a: [{}] }, { a: [{ [keySymbol]: 'deep' }] }, { key: keySymbol })
partialMerge({ _merge: 2 }, { _merge: 2 }, { key: 'key' })

expectError(partialMerge({}, {}, true))
expectError(partialMerge({}, {}, { unknownOption: true }))
expectError(partialMerge({}, {}, { key: 0 }))
expectError(partialMerge({ a: 1 }, { b: 2 }))
expectError(partialMerge({ c: { a: 1 } }, { c: { b: 2 } }))
expectError(partialMerge({ a: [1] }, { a: [true] }))
expectError(partialMerge({ a: [1] }, { a: { '1': true } }))
expectError(partialMerge({ a: 1 }, { a: 2, _merge: 2 }))
expectError(partialMerge({ a: 1, _merge: 1 }, { a: 2, _merge: 2 }))
expectError(partialMerge({}, { key: 2 }, { key: 'key' }))
expectError(partialMerge({ a: [{}] }, { a: [{ key: 2 }] }, { key: 'key' }))
expectError(
  partialMerge(
    { a: [{}] },
    { a: [{ [keySymbol]: 2 }] },
    { [keySymbol]: 'key' },
  ),
)
