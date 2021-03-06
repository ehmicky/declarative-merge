// Deleted values use a special symbol which must be checked by the consumer.
// This is internal and not exposed to users.
export const removeDeletedItems = function (array) {
  return array.some(isDeleted) ? array.filter(isNotDeleted) : array
}

export const getDeleted = function (mergeFlag, DELETE_MERGE) {
  return mergeFlag === DELETE_MERGE ? DELETED_SYM : undefined
}

const isNotDeleted = function (value) {
  return !isDeleted(value)
}

export const isDeleted = function (value) {
  return value === DELETED_SYM
}

const DELETED_SYM = Symbol('deleted')
