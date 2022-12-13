// Deleted values use a special symbol which must be checked by the consumer.
// This is internal and not exposed to users.
export const removeDeletedItems = (array) =>
  array.some(isDeleted) ? array.filter(isNotDeleted) : array

export const getDeleted = (mergeFlag, DELETE_MERGE) =>
  mergeFlag === DELETE_MERGE ? DELETED_SYM : undefined

const isNotDeleted = (value) => !isDeleted(value)

export const isDeleted = (value) => value === DELETED_SYM

const DELETED_SYM = Symbol('deleted')
