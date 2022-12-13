import isPlainObj from 'is-plain-obj'

import { removeDeletedItems } from './delete.js'
import { getEnumKeys } from './enum.js'

// Arguments are deep cloned:
//  - This ensures the original argument won't be modified by the user
//  - Deep cloning might be expected from a deep merge by some users
//  - This ensures the algorithm is performed recursively, so that
//    non-enumerable and inherited properties are removed
export const cloneFirstValue = (value) => {
  if (Array.isArray(value)) {
    return value.map(cloneFirstValue)
  }

  if (isPlainObj(value)) {
    return cloneFirstObject(value)
  }

  return value
}

const cloneFirstObject = (value) => {
  const newObject = {}

  // eslint-disable-next-line fp/no-loops
  for (const key of getEnumKeys(value)) {
    // eslint-disable-next-line fp/no-mutation
    newObject[key] = cloneFirstValue(value[key])
  }

  return newObject
}

// The `secondValue` performed the full algorithm so that `_merge` properties
// and array updates objects are resolved too
export const cloneSecondValue = (value, mergeValues, key) => {
  if (Array.isArray(value)) {
    const newArray = value.map((item) =>
      cloneSecondValue(item, mergeValues, key),
    )
    return removeDeletedItems(newArray)
  }

  if (isPlainObj(value)) {
    return mergeValues({
      firstValue: {},
      secondValue: value,
      currentMerge: false,
      key,
    })
  }

  return value
}
