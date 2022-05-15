import isPlainObj from 'is-plain-obj'
import { set as setArray, test as isArrayPatch } from 'set-array'

// Deeply merge objects.
// Inherited and non-enumerable properties are ignored.
// Symbol properties are kept.
// Plain objects are deeply cloned. Non-plain objects (and their children) are
// not cloned.
// If the second argument is an object with a property `_set: true`, the first
// argument is overridden instead of being merged to.
//  - Children can change this property. This allows nesting objects.
// If the first argument is an array and the second argument is a patch object
// (like `{ 1: 'a', 3: 'f' }`, or an empty object), the array is patched.
//  - It is patched even if `_set` is `true`
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

const mergeValues = function (firstValue, secondValue, setFlag) {
  if (!isPlainObj(secondValue)) {
    return secondValue
  }

  const { setFlag: setFlagA, secondObject } = parseSetFlag(secondValue, setFlag)

  if (shouldPatchArray(firstValue, secondObject)) {
    return patchArray(firstValue, secondObject, setFlagA)
  }

  if (!isPlainObj(firstValue)) {
    return deepCloneObject(secondObject, setFlagA)
  }

  return deepMergeObjects(firstValue, secondObject, setFlagA)
}

const shouldPatchArray = function (firstValue, secondObject) {
  return Array.isArray(firstValue) && isArrayPatch(secondObject)
}

const patchArray = function (array, updates, setFlag) {
  return setArray(array, updates, {
    merge(firstValue, secondValue) {
      return mergeValues(firstValue, secondValue, setFlag)
    },
  })
}

const parseSetFlag = function (secondObject, setFlag) {
  // eslint-disable-next-line no-underscore-dangle
  if (typeof secondObject._set !== 'boolean') {
    return { setFlag, secondObject }
  }

  const { _set: setFlagA, ...secondObjectA } = secondObject
  return { setFlag: setFlagA, secondObject: secondObjectA }
}

// TODO: refactor
// eslint-disable-next-line complexity
const deepMergeObjects = function (firstObject, secondObject, setFlag) {
  const newObject = {}

  if (!setFlag) {
    // eslint-disable-next-line fp/no-loops, max-depth
    for (const firstKey of getEnumKeys(firstObject)) {
      // eslint-disable-next-line max-depth
      if (!isEnum.call(secondObject, firstKey)) {
        // eslint-disable-next-line fp/no-mutation
        newObject[firstKey] = deepClone(firstObject[firstKey], setFlag)
      }
    }
  }

  // eslint-disable-next-line fp/no-loops
  for (const secondKey of getEnumKeys(secondObject)) {
    const firstProp = getEnumValue(firstObject, secondKey)
    const secondProp = secondObject[secondKey]
    // eslint-disable-next-line fp/no-mutation
    newObject[secondKey] = mergeValues(firstProp, secondProp, setFlag)
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

const deepClone = function (value, setFlag) {
  return isPlainObj(value) ? deepCloneObject(value, setFlag) : value
}

const deepCloneObject = function (object, setFlag) {
  return deepMergeObjects({}, object, setFlag)
}
