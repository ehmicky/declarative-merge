import isPlainObj from 'is-plain-obj'
import { set as setArray, test as isArrayPatch } from 'set-array'

// Deeply merge objects.
// Inherited and non-enumerable properties are ignored.
// Symbol properties are kept.
// Plain objects are deeply cloned. Non-plain objects (and their children) are
// not cloned.
// If the second argument is an object with a property `_set: true`, the first
// argument is overridden instead of being merged to.
// If the first argument is an array and the second argument is a patch object
// (like `{ 1: 'a', 3: 'f' }`, or an empty object), the array is patched.
// `_set` and patch objects are only allowed in the second argument:
//  - They are considered normal properties in first argument
//     - Reason: they would not make sense since the first argument has lower
//       priority
//  - If the first argument might use those formats, `not-deep-merge` should be
//    applied to it first, using an empty object as first argument.
// eslint-disable-next-line complexity
export default function notDeepMerge(firstValue, secondValue) {
  if (!isPlainObj(secondValue)) {
    return secondValue
  }

  if (shouldSet(secondValue)) {
    return deepCloneSet(secondValue)
  }

  if (shouldPatchArray(firstValue, secondValue)) {
    return setArray(firstValue, secondValue, { merge: notDeepMerge })
  }

  if (!isPlainObj(firstValue)) {
    return deepClone(secondValue)
  }

  return deepMergeObjects(firstValue, secondValue)
}

const shouldSet = function (object) {
  // eslint-disable-next-line no-underscore-dangle
  return object._set === true
}

const deepCloneSet = function (object) {
  const objectCopy = deepClone(object)
  // eslint-disable-next-line fp/no-delete, no-underscore-dangle
  delete objectCopy._set
  return objectCopy
}

const shouldPatchArray = function (firstValue, secondObject) {
  return Array.isArray(firstValue) && isArrayPatch(secondObject)
}

const deepMergeObjects = function (firstObject, secondObject) {
  const newObject = { ...firstObject }

  // eslint-disable-next-line fp/no-loops
  for (const key of getEnumKeys(secondObject)) {
    const firstProp = getEnumValue(firstObject, key)
    const secondProp = secondObject[key]
    // eslint-disable-next-line fp/no-mutation
    newObject[key] = notDeepMerge(firstProp, secondProp)
  }

  return newObject
}

const { propertyIsEnumerable: isEnum } = Object.prototype

const getEnumKeys = function (object) {
  const keys = Object.keys(object)
  const symbols = Object.getOwnPropertySymbols(object)
  return symbols.length === 0
    ? keys
    : [...keys, ...symbols.filter((symbol) => isEnum.call(object, symbol))]
}

const getEnumValue = function (object, key) {
  return isEnum.call(object, key) ? object[key] : undefined
}

const deepClone = function (object) {
  return deepMergeObjects({}, object)
}
