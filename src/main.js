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

const mergeValues = function (firstValue, secondValue, currentSet) {
  if (!isPlainObj(secondValue)) {
    return secondValue
  }

  const {
    currentSet: currentSetA,
    childSet,
    secondObject,
  } = parseSetFlag(secondValue, currentSet)

  if (shouldPatchArray(firstValue, secondObject)) {
    return patchArray(firstValue, secondObject, childSet)
  }

  if (!isPlainObj(firstValue)) {
    return deepCloneObject(secondObject, childSet)
  }

  return deepMergeObjects(firstValue, secondObject, currentSetA, childSet)
}

const shouldPatchArray = function (firstValue, secondObject) {
  return Array.isArray(firstValue) && isArrayPatch(secondObject)
}

const patchArray = function (array, updates, childSet) {
  return setArray(array, updates, {
    merge(firstValue, secondValue) {
      return mergeValues(firstValue, secondValue, childSet)
    },
  })
}

const parseSetFlag = function (secondObject, currentSet) {
  // eslint-disable-next-line no-underscore-dangle
  if (typeof secondObject._set !== 'boolean' && secondObject._set !== null) {
    return { currentSet, childSet: currentSet, secondObject }
  }

  const { _set: setFlag, ...secondObjectA } = secondObject
  return setFlag === null
    ? { currentSet: false, childSet: true, secondObject: secondObjectA }
    : { currentSet: setFlag, childSet: setFlag, secondObject: secondObjectA }
}

// eslint-disable-next-line max-params
const deepMergeObjects = function (
  firstObject,
  secondObject,
  currentSet,
  childSet,
) {
  const newObject = {}
  setFirstValues(firstObject, secondObject, newObject, currentSet, childSet)
  setSecondValues(firstObject, secondObject, newObject, childSet)
  return newObject
}

// eslint-disable-next-line max-params
const setFirstValues = function (
  firstObject,
  secondObject,
  newObject,
  currentSet,
  childSet,
) {
  if (currentSet) {
    return
  }

  // eslint-disable-next-line fp/no-loops
  for (const firstKey of getEnumKeys(firstObject)) {
    // eslint-disable-next-line max-depth
    if (!isEnum.call(secondObject, firstKey)) {
      // eslint-disable-next-line fp/no-mutation, no-param-reassign
      newObject[firstKey] = deepClone(firstObject[firstKey], childSet)
    }
  }
}

// eslint-disable-next-line max-params
const setSecondValues = function (
  firstObject,
  secondObject,
  newObject,
  childSet,
) {
  // eslint-disable-next-line fp/no-loops
  for (const secondKey of getEnumKeys(secondObject)) {
    const firstProp = getEnumValue(firstObject, secondKey)
    const secondProp = secondObject[secondKey]
    // eslint-disable-next-line fp/no-mutation, no-param-reassign
    newObject[secondKey] = mergeValues(firstProp, secondProp, childSet)
  }
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

const deepClone = function (value, childSet) {
  return isPlainObj(value) ? deepCloneObject(value, childSet) : value
}

const deepCloneObject = function (object, childSet) {
  return deepMergeObjects({}, object, true, childSet)
}
