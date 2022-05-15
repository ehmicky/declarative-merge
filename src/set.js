// Parse the `_set` flag that objects can specify to override the merge mode.
// Allowed values:
//  - `false` (default): deep merge
//  - `null`: shallow merge
//  - `true`: no merge
// If `_set` is not of the allowed values (including `undefined`), it inherits
// its value from its parent.
//  - Therefore, we distinguish between the current object's `_set` and its
//    children
// The `_set` flag is removed from the object before processing it.
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
