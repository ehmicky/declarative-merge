import { Updates } from 'set-array'

/**
 * Merge `firstValue` and `secondValue`.
 *
 * Any object can change the merge mode using a `_merge` property with
 * value `"deep"` (default), `"shallow"`, `"set"` or `"delete"`.
 *
 * Arrays can be merged using objects where the keys are the array indices.
 * Items can be updated, merged, added, inserted, appended, prepended, deleted
 * or set.
 *
 * `firstValue` and `secondValue` are not modified. Plain objects and arrays
 * are deeply cloned. Inherited and non-enumerable properties are ignored.
 *
 * @example
 * ```js
 * // Deep merge
 * declarativeMerge({ a: 1, b: { c: 2 }, d: 3 }, { a: 10, b: { e: 20 } })
 * // { a: 10, b: { c: 2, e: 20 }, d: 3 }
 *
 * // Shallow merge
 * declarativeMerge(
 *   { a: 1, b: { c: 2 }, d: 3 },
 *   { a: 10, b: { e: 20 }, _merge: 'shallow' },
 * )
 * // { a: 10, b: { e: 20 }, d: 3 }
 *
 * // No merge
 * declarativeMerge(
 *   { a: 1, b: { c: 2 }, d: 3 },
 *   { a: 10, b: { e: 20 }, _merge: 'set' },
 * )
 * // { a: 10, b: { e: 20 } }
 *
 * // `_merge` can be specified in nested objects
 * declarativeMerge(
 *   { a: 1, b: { c: 2 }, d: 3 },
 *   { a: 10, b: { e: 20, _merge: 'set' } },
 * )
 * // { a: 10, b: { e: 20 }, d: 3 }
 *
 * declarativeMerge(
 *   { a: 1, b: { c: 2 }, d: 3 },
 *   { a: 10, b: { e: 20, _merge: 'deep' }, _merge: 'set' },
 * )
 * // { a: 10, b: { c: 2, e: 20 } }
 *
 * // Delete
 * declarativeMerge(
 *   { a: 1, b: { c: 2 }, d: 3 },
 *   { a: 10, b: { e: 20, _merge: 'delete' } },
 * )
 * // { a: 10, d: 3 }
 *
 * // By default, arrays override each other
 * declarativeMerge({ one: ['a', 'b', 'c'] }, { one: ['X', 'Y'] }) // { one: ['X', 'Y'] }
 *
 * // They can be updated instead using an object where the keys are the array
 * // indices (before any updates).
 * declarativeMerge(
 *   { one: ['a', 'b', 'c'], two: 2 },
 *   { one: { 1: 'X' }, three: 3 },
 * )
 * // { one: ['a', 'X', 'c'], two: 2, three: 3 }
 *
 * // This works on top-level arrays too
 * declarativeMerge(['a', 'b', 'c'], { 1: 'X', 2: 'Y' }) // ['a', 'X', 'Y']
 *
 * // If the new array items are objects, they are merged
 * declarativeMerge(
 *   [{ id: 'a' }, { id: 'b', value: { name: 'Ann' } }, { id: 'c' }],
 *   { 1: { value: { color: 'red' } } },
 * )
 * // [{ id: 'a' }, { id: 'b', value: { name: 'Ann', color: 'red' } }, { id: 'c' }]
 *
 * declarativeMerge(
 *   [{ id: 'a' }, { id: 'b', value: { name: 'Ann' } }, { id: 'c' }],
 *   { 1: { value: { color: 'red' }, _merge: 'shallow' } },
 * )
 * // [{ id: 'a' }, { id: 'b', value: { color: 'red' } }, { id: 'c' }]
 *
 * // Indices
 * declarativeMerge(['a', 'b', 'c'], { '*': 'X' }) // ['X', 'X', 'X']
 * declarativeMerge(['a', 'b', 'c'], { '-1': 'X' }) // ['a', 'b', 'X']
 * declarativeMerge(['a', 'b', 'c'], { 4: 'X' }) // ['a', 'b', 'c', undefined, 'X']
 *
 * // Array of items can be used
 * declarativeMerge(['a', 'b', 'c'], { 1: ['X', 'Y'] }) // ['a', 'X', 'Y', 'c']
 * declarativeMerge(['a', 'b', 'c'], { 1: ['X'] }) // ['a', 'X', 'c']
 * declarativeMerge(['a', 'b', 'c'], { 1: [['X']] }) // ['a', ['X'], 'c']
 *
 * // If the key ends with +, items are prepended, not replaced
 * declarativeMerge(['a', 'b', 'c'], { '1+': 'X' }) // ['a', 'X', 'b', 'c']
 *
 * // Append
 * declarativeMerge(['a', 'b', 'c'], { '-0': 'X' }) // ['a', 'b', 'c', 'X']
 * declarativeMerge(['a', 'b', 'c'], { '-0': ['X', 'Y'] }) // ['a', 'b', 'c', 'X', 'Y']
 *
 * // Prepend
 * declarativeMerge(['a', 'b', 'c'], { '0+': ['X', 'Y'] }) // ['X', 'Y', 'a', 'b', 'c']
 *
 * // Delete
 * declarativeMerge(['a', 'b', 'c'], { 1: [] }) // ['a', 'c']
 *
 * // Set
 * declarativeMerge({}, { one: { 0: 'X', 2: 'Z' } }) // { one: ['X', undefined, 'Z'] }
 * declarativeMerge({ one: true }, { one: { 0: 'X', 2: 'Z' } }) // { one: ['X', undefined, 'Z'] }
 * ```
 */
export default function declarativeMerge<T, KeyOpt extends Key = DefaultKey>(
  firstValue: T,
  secondValue: SecondValue<T, NoInfer<KeyOpt>>,
  options?: Options<KeyOpt>,
): T

// Ensure `T` is not inferred.
// See https://github.com/microsoft/TypeScript/issues/14829
type NoInfer<T> = T extends any ? T : T

interface Options<KeyOpt> {
  /**
   * Name of the property used to specify the merge mode.
   * Symbols can be useful to prevent injections when the input is user-provided.
   *
   * @default "_merge"
   *
   * @example
   * ```js
   * declarativeMerge({ a: 1 }, { b: 2, _mergeMode: 'set' }, { key: '_mergeMode' }) // { b: 2 }
   *
   * const mergeMode = Symbol('mergeMode')
   * declarativeMerge({ a: 1 }, { b: 2, [mergeMode]: 'set' }, { key: mergeMode }) // { b: 2 }
   * ```
   */
  key?: KeyOpt
}

/**
 * `key` option's type
 */
type Key = string | symbol

/**
 * `key` option's default value
 */
type DefaultKey = '_merge'

/**
 * The second value has the same shape as the first except:
 *  - Objects can modify the merge mode using a `_merge` property
 *  - Arrays can be "updates" objects instead like { [index]: item, ... }
 */
type SecondValue<T, KeyOpt extends Key> = T extends (infer ArrayItem)[]
  ? SecondValue<ArrayItem, KeyOpt>[] | Updates<SecondValue<ArrayItem, KeyOpt>>
  : T extends object
  ? {
      [Prop in Exclude<keyof T, KeyOpt>]?: SecondValue<T[Prop], KeyOpt>
    } & { [KeyProp in KeyOpt]?: MergeMode }
  : T

/**
 * Modifies the merge mode.
 */
type MergeMode = 'deep' | 'shallow' | 'set' | 'delete'
