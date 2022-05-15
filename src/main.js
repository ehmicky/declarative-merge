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
//  - If the first argument might use those formats, `partial-merge` should be
//    applied to it first, using an empty object as first argument.
// eslint-disable-next-line complexity
export default function partialMerge(firstValue, secondValue) {
  if (!isPlainObj(secondValue)) {
    return secondValue
  }

  const { set, secondObject } = parseSet(secondValue)

  if (set) {
    return deepCloneObject(secondObject)
  }

  if (shouldPatchArray(firstValue, secondObject)) {
    return setArray(firstValue, secondObject, { merge: partialMerge })
  }

  if (!isPlainObj(firstValue)) {
    return deepCloneObject(secondObject)
  }

  return deepMergeObjects(firstValue, secondObject)
}

const parseSet = function (secondObject) {
  // eslint-disable-next-line no-underscore-dangle
  if (typeof secondObject._set !== 'boolean') {
    return { secondObject }
  }

  const { _set: set, ...secondObjectA } = secondObject
  return { set, secondObject: secondObjectA }
}

const shouldPatchArray = function (firstValue, secondObject) {
  return Array.isArray(firstValue) && isArrayPatch(secondObject)
}

const deepMergeObjects = function (firstObject, secondObject) {
  const newObject = {}

  // eslint-disable-next-line fp/no-loops
  for (const secondKey of getEnumKeys(secondObject)) {
    const firstProp = getEnumValue(firstObject, secondKey)
    const secondProp = secondObject[secondKey]
    // eslint-disable-next-line fp/no-mutation
    newObject[secondKey] = partialMerge(firstProp, secondProp)
  }

  // eslint-disable-next-line fp/no-loops
  for (const firstKey of getEnumKeys(firstObject)) {
    // eslint-disable-next-line max-depth
    if (!isEnum.call(newObject, firstKey)) {
      // eslint-disable-next-line fp/no-mutation
      newObject[firstKey] = deepClone(firstObject[firstKey])
    }
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

const deepClone = function (value) {
  return isPlainObj(value) ? deepCloneObject(value) : value
}

const deepCloneObject = function (object) {
  return deepMergeObjects({}, object)
}
