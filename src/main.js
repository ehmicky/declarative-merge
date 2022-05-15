import isPlainObj from 'is-plain-obj'

import { shouldPatchArray, patchArray } from './array.js'
import { DEFAULT_MERGE, parseMergeFlag } from './merge.js'
import { deepMergeObjects, deepCloneObject } from './object.js'

// Merge objects deeply, shallowly, or both.
// Properties that are:
//  - Inherited and non-enumerable are ignored.
//  - Symbols are kept.
// The arguments are not modified.
//  - Plain objects are deeply cloned.
//  - Non-plain objects (and their children) are not cloned.
// The merge mode can be specified on any object in the second argument with a
// `_merge` property:
//  - Possible values:
//     - "deep" (def): deep merge
//     - "shallow": shallow merge
//     - "none": no merge
//  - Children can override that property, which is convenient when nesting
//    objects
// If the first argument is an array and the second argument is a patch object
// (like `{ 1: 'a', 3: 'f' }`, or an empty object), the array is patched.
//  - It is patched regardless of the current `_merge` value
//  - New elements are merged using the current `_merge` value
// `_merge` and patch objects are only allowed in the second argument:
//  - They are considered normal properties in first argument
//     - Reason: they would not make sense since the first argument has lower
//       priority
//  - If the first argument might use those formats, `partial-merge` should be
//    applied to it first, using an empty object as first argument.
export default function partialMerge(firstValue, secondValue) {
  return mergeValues(firstValue, secondValue, DEFAULT_MERGE)
}

// This function is called recursively, i.e. it is passed down as argument
const mergeValues = function (firstValue, secondValue, currentMerge) {
  if (!isPlainObj(secondValue)) {
    return secondValue
  }

  const {
    currentMerge: currentMergeA,
    childMerge,
    secondObject,
  } = parseMergeFlag(secondValue, currentMerge)

  if (shouldPatchArray(firstValue, secondObject)) {
    return patchArray(firstValue, secondObject, childMerge, mergeValues)
  }

  if (!isPlainObj(firstValue)) {
    return deepCloneObject(secondObject, mergeValues)
  }

  return deepMergeObjects({
    firstObject: firstValue,
    secondObject,
    currentMerge: currentMergeA,
    childMerge,
    mergeValues,
  })
}
