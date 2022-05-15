import isPlainObj from 'is-plain-obj'

import { isEnum, getEnumKeys, getEnumValue } from './enum.js'

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
    setFirstValues(firstObject, secondObject, newObject, mergeValues)
  }

  setSecondValues(firstObject, secondObject, newObject, childSet, mergeValues)
  return newObject
}

// eslint-disable-next-line max-params
const setFirstValues = function (
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

// eslint-disable-next-line max-params
const setSecondValues = function (
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

export const deepCloneObject = function (object, mergeValues) {
  return deepMergeObjects({}, object, true, true, mergeValues)
}
