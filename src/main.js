import isPlainObj from 'is-plain-obj'

import { shouldPatchArray, patchArray } from './array.js'
import { deepMergeObjects, deepCloneObject } from './object.js'
import { parseSetFlag } from './set.js'

// Merge objects deeply, shallowly, or both.
// Properties that are:
//  - Inherited and non-enumerable are ignored.
//  - Symbols are kept.
// The arguments are not modified.
//  - Plain objects are deeply cloned.
//  - Non-plain objects (and their children) are not cloned.
// The merge mode can be specified on any object in the second argument with a
// `_set` property:
//  - Possible values:
//     - `false` (def): deep merge
//     - `null`: shallow merge
//     - `true`: no merge
//  - Children can override that property, which is convenient when nesting
//    objects
// If the first argument is an array and the second argument is a patch object
// (like `{ 1: 'a', 3: 'f' }`, or an empty object), the array is patched.
//  - It is patched regardless of whether `_set` is used
//  - New elements are merged using the current `_set` value
// `_set` and patch objects are only allowed in the second argument:
//  - They are considered normal properties in first argument
//     - Reason: they would not make sense since the first argument has lower
//       priority
//  - If the first argument might use those formats, `partial-merge` should be
//    applied to it first, using an empty object as first argument.
export default function partialMerge(firstValue, secondValue) {
  return mergeValues(firstValue, secondValue, false)
}

const mergeValues = function (firstValue, secondValue, currentSet) {
  if (!isPlainObj(secondValue)) {
    return secondValue
  }

  const {
    currentSet: currentSetA,
    childSet,
    secondObject,
  } = parseSetFlag(secondValue, currentSet)

  if (shouldPatchArray(firstValue, secondObject)) {
    return patchArray(firstValue, secondObject, childSet, mergeValues)
  }

  if (!isPlainObj(firstValue)) {
    return deepCloneObject(secondObject, mergeValues)
  }

  return deepMergeObjects(
    firstValue,
    secondObject,
    currentSetA,
    childSet,
    mergeValues,
  )
}
