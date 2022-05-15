import isPlainObj from 'is-plain-obj'

// Deeply merge objects.
// Inherited and non-enumerable properties are ignored.
// Symbol properties are kept.
// Plain objects are deeply cloned. Non-plain objects (and their children) are
// not cloned.
export default function notDeepMerge(firstValue, secondValue) {
  return deepMerge(firstValue, secondValue, false)
}

const deepMerge = function (firstValue, secondValue) {
  if (!isPlainObj(secondValue)) {
    return secondValue
  }

  if (shouldSet(secondValue)) {
    return deepCloneSet(secondValue)
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

const deepClone = function (object) {
  return deepMerge({}, object)
}

const deepMergeObjects = function (firstObject, secondObject) {
  const newObject = {}

  // eslint-disable-next-line fp/no-loops
  for (const key of getEnumKeys(secondObject)) {
    const firstProp = getEnumValue(firstObject, key)
    const secondProp = secondObject[key]
    // eslint-disable-next-line fp/no-mutation
    newObject[key] = deepMerge(firstProp, secondProp)
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
