import { set as setArray, test as isUpdatesObject } from 'set-array'

import { removeDeletedItems } from './delete.js'

// Test whether the `secondObject` is an array `updates` object like
// `{ [index]: values, ... }`
// Empty objects are not considered array `updates` objects.
//  - Reason: it is ambiguous whether they are meant this way, especially when
//    the `firstValue` is `undefined`
export const shouldPatchArray = function (secondObject) {
  return isUpdatesObject(secondObject) && Object.keys(secondObject).length !== 0
}

// Patch an array using an `updates` object.
// When the `firstValue` is not an array (including `undefined`), an empty array
// is used instead:
//  - This ensures `updates` objects are always resolved
//  - This works better with a polymorphic `firstValue`, e.g. a value which can
//    optionally be an array or not
//  - This allows knowing whether the `secondValue` is an `updates` object
//    without having to check the `firstValue`, i.e. this is less ambiguous
export const patchArray = function ({
  firstValue,
  updates,
  childMerge,
  mergeValues,
  key,
}) {
  const array = Array.isArray(firstValue) ? firstValue : []
  const newArray = setArray(array, updates, {
    merge: (firstChild, secondChild) =>
      mergeValues({
        firstValue: firstChild,
        secondValue: secondChild,
        currentMerge: childMerge,
        key,
      }),
  })
  return removeDeletedItems(newArray)
}
