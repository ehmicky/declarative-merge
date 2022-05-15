import isPlainObj from 'is-plain-obj'

import { isEnum, getEnumKeys, getEnumValue } from './enum.js'

// Merge two objects deeply.
// Pass positional arguments for performance reasons.
// eslint-disable-next-line max-params
export const deepMergeObjects = function (
  firstObject,
  secondObject,
  currentSet,
  childSet,
  mergeValues,
) {
  const newObject = {}

  if (!currentSet) {
    setFirstProps(firstObject, secondObject, newObject, mergeValues)
  }

  setSecondProps(firstObject, secondObject, newObject, childSet, mergeValues)
  return newObject
}

// All properties from the `firstObject` not in the `secondObject` are kept.
// If `_set` is `true`, this is skipped.
// eslint-disable-next-line max-params
const setFirstProps = function (
  firstObject,
  secondObject,
  newObject,
  mergeValues,
) {
  // eslint-disable-next-line fp/no-loops
  for (const firstKey of getEnumKeys(firstObject)) {
    // eslint-disable-next-line max-depth
    if (!isEnum(secondObject, firstKey)) {
      // eslint-disable-next-line fp/no-mutation, no-param-reassign
      newObject[firstKey] = deepClone(firstObject[firstKey], mergeValues)
    }
  }
}

// Properties from `secondObject` are merged to the `firstObject`, recursively
// eslint-disable-next-line max-params
const setSecondProps = function (
  firstObject,
  secondObject,
  newObject,
  childSet,
  mergeValues,
) {
  // eslint-disable-next-line fp/no-loops
  for (const secondKey of getEnumKeys(secondObject)) {
    const firstProp = getEnumValue(firstObject, secondKey)
    const secondProp = secondObject[secondKey]
    // eslint-disable-next-line fp/no-mutation, no-param-reassign
    newObject[secondKey] = mergeValues(firstProp, secondProp, childSet)
  }
}

const deepClone = function (value, mergeValues) {
  return isPlainObj(value) ? deepCloneObject(value, mergeValues) : value
}

// Before setting values, we deep clone them:
//  - This ensures the original argument won't be modified by the user
//  - Deep cloning might be expected from a deep merge by some users
//  - This ensures the algorithm is performed recursively, so that:
//     - `_set` property are removed
//     - Non-enumerable and inherited properties are removed
export const deepCloneObject = function (object, mergeValues) {
  return deepMergeObjects({}, object, true, true, mergeValues)
}
