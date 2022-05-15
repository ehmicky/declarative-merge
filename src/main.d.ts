import { Updates } from 'set-array'

type MergeValue = boolean | null

/**
 * Modifies the merge mode. Can be:
 *  - `false` (default): deep merge
 *  - `null`: shallow merge
 *  - `true`: no merge
 */
type MergeAttribute<T> = T extends { _merge?: infer U }
  ? { _merge?: MergeValue | U }
  : { _merge?: MergeValue }

/**
 * The second value has the same shape as the first except:
 *  - Objects can modify the merge mode using a `_merge` property
 *  - Arrays can be "updates" objects instead like { [index]: item, ... }
 */
type SecondValue<T> = T extends (infer ArrayItemType)[]
  ? SecondValue<ArrayItemType>[] | Updates<SecondValue<ArrayItemType>>
  : T extends object
  ? {
      [U in Exclude<keyof T, '_merge'>]?: SecondValue<T[U]>
    } & MergeAttribute<T>
  : T

/**
 *
 * @example
 * ```js
 * ```
 */
export default function partialMerge<T>(
  firstValue: T,
  secondValue: SecondValue<T>,
): T
