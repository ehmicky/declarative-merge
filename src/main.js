import isPlainObj from 'is-plain-obj'

import { shouldPatchArray, patchArray } from './array.js'
import { DEFAULT_MERGE, parseMergeFlag, isDeleted } from './merge.js'
import { deepMergeObjects, deepCloneObject } from './object.js'
import { getOptions } from './options.js'

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
//     - "set": no merge
//     - "delete": delete the property
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
// When `_merge: "delete"` is used:
//  - The property is deleted instead.
//  - Inside an array update:
//     - The item is filtered out
//     - This is performed after the `updates` indices are computed
//  - At the top-level, `undefined` is returned.
//  - Sibling and child properties will be ignored, including any child `_merge`
//     - I.e. unlike other `_merge` modes, the parent has the priority here
//  - Users can still set `undefined` or `null` values, which remains a separate
//    operation from deletion
export default function partialMerge(firstValue, secondValue, options) {
  const { key } = getOptions(options)
  const mergedValue = mergeValues({
    firstValue,
    secondValue,
    currentMerge: DEFAULT_MERGE,
    key,
  })
  return isDeleted(mergedValue) ? undefined : mergedValue
}

// This function is called recursively, i.e. it is passed down as argument
const mergeValues = function ({ firstValue, secondValue, currentMerge, key }) {
  if (!isPlainObj(secondValue)) {
    return secondValue
  }

  const {
    currentMerge: currentMergeA,
    childMerge,
    deleted,
    secondObject,
  } = parseMergeFlag(secondValue, currentMerge, key)

  if (deleted !== undefined) {
    return deleted
  }

  return mergeSecondObject({
    firstValue,
    secondObject,
    currentMerge: currentMergeA,
    childMerge,
    key,
  })
}

const mergeSecondObject = function ({
  firstValue,
  secondObject,
  currentMerge,
  childMerge,
  key,
}) {
  if (shouldPatchArray(firstValue, secondObject)) {
    return patchArray({
      array: firstValue,
      updates: secondObject,
      childMerge,
      mergeValues,
      key,
    })
  }

  if (!isPlainObj(firstValue)) {
    return deepCloneObject(secondObject, mergeValues, key)
  }

  return deepMergeObjects({
    firstObject: firstValue,
    secondObject,
    currentMerge,
    childMerge,
    mergeValues,
    key,
  })
}
