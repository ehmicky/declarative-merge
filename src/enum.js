// Retrieve object keys, including symbols, but excluding inherited and
// non-enumerable properties
export const getEnumKeys = function (object) {
  const keys = Object.keys(object)
  const symbols = Object.getOwnPropertySymbols(object)
  return symbols.length === 0
    ? keys
    : [...keys, ...symbols.filter((symbol) => isEnum(object, symbol))]
}

// When merging an own enumerable property from `secondObject` but that property
// is inherited or non-enumerable in `firstObject`, we use `undefined` instead
export const getEnumValue = function (object, key) {
  return isEnum(object, key) ? object[key] : undefined
}

const { propertyIsEnumerable: isEnumerable } = Object.prototype

// Test if a property is own and enumerable
export const isEnum = function (object, propName) {
  return isEnumerable.call(object, propName)
}
