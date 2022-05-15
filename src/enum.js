export const getEnumKeys = function (object) {
  const keys = Object.keys(object)
  const symbols = Object.getOwnPropertySymbols(object)
  return symbols.length === 0
    ? keys
    : [...keys, ...symbols.filter((symbol) => isEnum(object, symbol))]
}

export const getEnumValue = function (object, key) {
  return isEnum(object, key) ? object[key] : undefined
}

const { propertyIsEnumerable: isEnumerable } = Object.prototype

export const isEnum = function (object, propName) {
  return isEnumerable.call(object, propName)
}
