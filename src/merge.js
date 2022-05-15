// Parse the `_merge` flag that objects in the second argument can specify to
// override the merge mode.
// Allowed values:
//  - "deep" (default): deep merge
//  - "shallow": shallow merge
//  - "none": no merge
// If `_merge` is `undefined`, it inherits its value from its parent.
//  - Therefore, we distinguish between the current object's `_merge` and its
//    children
// The `_merge` flag is removed from the object before processing it.
// Other values are ignored.
// `_merge` properties in the first value are kept as is, and cannot be set.
export const parseMergeFlag = function (secondObject, currentMerge) {
  if (!('_merge' in secondObject)) {
    return { currentMerge, childMerge: currentMerge, secondObject }
  }

  const { _merge: mergeFlag, ...secondObjectA } = secondObject

  if (mergeFlag === undefined || !ALLOWED_MERGES.has(mergeFlag)) {
    return {
      currentMerge,
      childMerge: currentMerge,
      secondObject: secondObjectA,
    }
  }

  return {
    currentMerge: mergeFlag !== NO_MERGE,
    childMerge: mergeFlag === DEEP_MERGE,
    secondObject: secondObjectA,
  }
}

export const DEFAULT_MERGE = true
const DEEP_MERGE = 'deep'
const SHALLOW_MERGE = 'shallow'
const NO_MERGE = 'none'
const ALLOWED_MERGES = new Set([DEEP_MERGE, SHALLOW_MERGE, NO_MERGE])
