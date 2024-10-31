import isPlainObj from 'is-plain-obj'

import { patchArray, shouldPatchArray } from './array.js'
import { cloneSecondValue } from './clone.js'
import { isDeleted } from './delete.js'
import { DEFAULT_MERGE, parseMergeFlag } from './merge.js'
import { deepMergeObjects } from './object.js'
import { getOptions } from './options.js'

// Merge objects.
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
//  - Children can override that property (except for "delete"), which is
//    convenient when nesting objects
// If the second argument is a patch object (like `{ 1: 'a', 3: 'f' }`), the
// first value's property is patched as an array.
//  - If it is not an array (including `undefined`), an empty array is used
//    instead
//  - It is patched regardless of the current `_merge` value
//  - New elements are merged using the current `_merge` value
// `_merge` and patch objects are only allowed in the second argument:
//  - They are considered normal properties in first argument
//     - Reason: they would not make sense since the first argument has lower
//       priority
//  - If the first argument might use those formats, `declarative-merge` should
//    be applied to it first, using an empty object as first argument.
// When `_merge: "delete"` is used:
//  - The property is deleted instead.
//  - Inside an array update:
//     - The item is filtered out
//     - This is performed after the `updates` indices are computed
//  - At the top-level, `undefined` is returned.
//  - Sibling and child properties will be ignored
//  - Users can still set `undefined` or `null` values, which remains a separate
//    operation from deletion
const declarativeMerge = (firstValue, secondValue, options) => {
  const { key } = getOptions(options)
  const mergedValue = mergeValues({
    firstValue,
    secondValue,
    currentMerge: DEFAULT_MERGE,
    key,
  })
  return isDeleted(mergedValue) ? undefined : mergedValue
}

export default declarativeMerge

// This function is called recursively, i.e. it is passed down as argument
const mergeValues = ({ firstValue, secondValue, currentMerge, key }) => {
  if (!isPlainObj(secondValue)) {
    return cloneSecondValue(secondValue, mergeValues, key)
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

const mergeSecondObject = ({
  firstValue,
  secondObject,
  currentMerge,
  childMerge,
  key,
}) => {
  if (shouldPatchArray(secondObject)) {
    return patchArray({
      firstValue,
      updates: secondObject,
      childMerge,
      mergeValues,
      key,
    })
  }

  if (!isPlainObj(firstValue)) {
    return cloneSecondValue(secondObject, mergeValues, key)
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
