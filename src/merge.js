import { getDeleted } from './delete.js'

// Parse the `_merge` flag that objects in the second argument can specify to
// override the merge mode.
// Allowed values:
//  - "deep" (default): deep merge
//  - "shallow": shallow merge
//  - "set": no merge
//  - "delete": delete the property
// If `_merge` is `undefined`, it inherits its value from its parent.
//  - Therefore, we distinguish between the current object's `_merge` and its
//    children
// The `_merge` flag is removed from the object before processing it.
// Other values are ignored.
// `_merge` properties in the first value are kept as is, and cannot be set.
// The `key` option can be used to customize the name of the `_merge` key
//  - This is useful if `_merge` has some other meaning in the data, or if the
//    name does not fit well
//  - Symbols can be used to prevent any user injection of that special
//    attribute
export const parseMergeFlag = (secondObject, currentMerge, key) => {
  if (!(key in secondObject)) {
    return { currentMerge, childMerge: currentMerge, secondObject }
  }

  const { [key]: mergeFlag, ...secondObjectA } = secondObject

  if (mergeFlag === undefined) {
    return {
      currentMerge,
      childMerge: currentMerge,
      secondObject: secondObjectA,
    }
  }

  validateMergeFlag(mergeFlag, key)

  return {
    currentMerge: mergeFlag === DEEP_MERGE || mergeFlag === SHALLOW_MERGE,
    childMerge: mergeFlag === DEEP_MERGE,
    deleted: getDeleted(mergeFlag, DELETE_MERGE),
    secondObject: secondObjectA,
  }
}

const validateMergeFlag = (mergeFlag, key) => {
  if (!ALLOWED_MERGES.has(mergeFlag)) {
    const allowedMerges = [...ALLOWED_MERGES].map(quoteString).join(', ')
    throw new TypeError(
      `"${key}: ${mergeFlag}" property must have one of the following values instead: ${allowedMerges}`,
    )
  }
}

const quoteString = (value) => `"${value}"`

const DEEP_MERGE = 'deep'
const SHALLOW_MERGE = 'shallow'
const SET_MERGE = 'set'
const DELETE_MERGE = 'delete'
const ALLOWED_MERGES = new Set([
  DEEP_MERGE,
  SHALLOW_MERGE,
  SET_MERGE,
  DELETE_MERGE,
])

export const DEFAULT_MERGE = true
