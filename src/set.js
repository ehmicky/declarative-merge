// Parse the `_set` flag that objects can specify to override the merge mode
export const parseSetFlag = function (secondObject, currentSet) {
  // eslint-disable-next-line no-underscore-dangle
  if (typeof secondObject._set !== 'boolean' && secondObject._set !== null) {
    return { currentSet, childSet: currentSet, secondObject }
  }

  const { _set: setFlag, ...secondObjectA } = secondObject
  return setFlag === null
    ? { currentSet: false, childSet: true, secondObject: secondObjectA }
    : { currentSet: setFlag, childSet: setFlag, secondObject: secondObjectA }
}
