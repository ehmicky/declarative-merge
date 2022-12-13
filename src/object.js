import { cloneFirstValue } from './clone.js'
import { isDeleted } from './delete.js'
import { isEnum, getEnumKeys, getEnumValue } from './enum.js'

// Merge two objects deeply.
export const deepMergeObjects = ({
  firstObject,
  secondObject,
  currentMerge,
  childMerge,
  mergeValues,
  key,
}) => {
  const newObject = {}

  if (currentMerge) {
    setFirstProps(firstObject, secondObject, newObject)
  }

  setSecondProps({
    firstObject,
    secondObject,
    newObject,
    childMerge,
    mergeValues,
    key,
  })
  return newObject
}

// All properties from the `firstObject` not in the `secondObject` are kept.
// If `_merge` is "set", this is skipped.
// Properties from the `firstObject` that are in the `secondObject` are still
// set, even though they will be overridden, to keep the keys order.
//  - However, they are not cloned, as a performance optimization since they
//    will be overridden anyway
const setFirstProps = (firstObject, secondObject, newObject) => {
  // eslint-disable-next-line fp/no-loops
  for (const firstKey of getEnumKeys(firstObject)) {
    // eslint-disable-next-line fp/no-mutation, no-param-reassign
    newObject[firstKey] = isEnum(secondObject, firstKey)
      ? firstObject[firstKey]
      : cloneFirstValue(firstObject[firstKey])
  }
}

// Properties from `secondObject` are merged to the `firstObject`, recursively
const setSecondProps = ({
  firstObject,
  secondObject,
  newObject,
  childMerge,
  mergeValues,
  key,
}) => {
  // eslint-disable-next-line fp/no-loops
  for (const secondKey of getEnumKeys(secondObject)) {
    const firstValue = getEnumValue(firstObject, secondKey)
    const secondValue = secondObject[secondKey]
    const newValue = mergeValues({
      firstValue,
      secondValue,
      currentMerge: childMerge,
      key,
    })

    // eslint-disable-next-line max-depth
    if (isDeleted(newValue)) {
      // eslint-disable-next-line fp/no-delete, no-param-reassign
      delete newObject[secondKey]
    } else {
      // eslint-disable-next-line fp/no-mutation, no-param-reassign
      newObject[secondKey] = newValue
    }
  }
}
