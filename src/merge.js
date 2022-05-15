// Parse the `_merge` flag that objects can specify to override the merge mode.
// Allowed values:
//  - `false` (default): deep merge
//  - `null`: shallow merge
//  - `true`: no merge
// If `_merge` is not of the allowed values (including `undefined`), it inherits
// its value from its parent.
//  - Therefore, we distinguish between the current object's `_merge` and its
//    children
// The `_merge` flag is removed from the object before processing it.
export const parseMergeFlag = function (secondObject, currentMerge) {
  if (
    // eslint-disable-next-line no-underscore-dangle
    typeof secondObject._merge !== 'boolean' &&
    // eslint-disable-next-line no-underscore-dangle
    secondObject._merge !== null
  ) {
    return { currentMerge, childMerge: currentMerge, secondObject }
  }

  const { _merge: mergeFlag, ...secondObjectA } = secondObject
  return mergeFlag === null
    ? { currentMerge: false, childMerge: true, secondObject: secondObjectA }
    : {
        currentMerge: mergeFlag,
        childMerge: mergeFlag,
        secondObject: secondObjectA,
      }
}
