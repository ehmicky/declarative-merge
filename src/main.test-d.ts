import partialMerge from 'partial-merge'
import { expectType, expectError } from 'tsd'

const firstValue = { a: 1 }
expectType<typeof firstValue>(partialMerge(firstValue, {}))

partialMerge({ a: 1 }, {})
partialMerge({ a: 1 }, { a: 2 })
partialMerge({ b: { a: 1 } }, { b: { a: 2 } })
partialMerge({ a: 1 }, { a: 2, _set: true })
partialMerge({ a: 1 }, { a: 2, _set: false })
partialMerge({ a: 1 }, { a: 2, _set: null })
partialMerge({ a: 1, _set: 1 }, { a: 2, _set: 2 })
partialMerge({ a: 1, _set: 1 }, { a: 2, _set: true })
partialMerge({ a: 1, _set: 2 }, { a: 2 })
partialMerge({ b: { a: 1 } }, { b: { a: 2, _set: true } })
partialMerge({ a: [1] }, {})
partialMerge({ a: [1] }, { a: [2] })
partialMerge({ a: [1] }, { a: {} })
partialMerge({ a: [1] }, { a: { '1': 2 } })
partialMerge({ a: [1] }, { a: { '1': [2] } })
partialMerge({ a: [{ b: 1 }] }, { a: { '0': { b: 2, _set: true } } })
partialMerge({ a: [[{ b: 1 }]] }, { a: { '0': { '0': { b: 2, _set: true } } } })
partialMerge([1], {})
partialMerge([1], { '0': 2 })

expectError(partialMerge({}, {}, {}))
expectError(partialMerge({ a: 1 }, { b: 2 }))
expectError(partialMerge({ c: { a: 1 } }, { c: { b: 2 } }))
expectError(partialMerge({ a: [1] }, { a: [true] }))
expectError(partialMerge({ a: [1] }, { a: { '1': true } }))
expectError(partialMerge({ a: 1 }, { a: 2, _set: 2 }))
