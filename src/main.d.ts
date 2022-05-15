import { Updates } from 'set-array'

type SetValue = boolean | null

/**
 * Modifies the merge mode. Can be:
 *  - `false` (default): deep merge
 *  - `null`: shallow merge
 *  - `true`: no merge
 */
type SetAttribute<T> = T extends { _set?: infer U }
  ? { _set?: SetValue | U }
  : { _set?: SetValue }

/**
 * The second value has the same shape as the first except:
 *  - Objects can modify the merge mode using a `_set` property
 *  - Arrays can be "updates" objects instead like { [index]: item, ... }
 */
type SecondValue<T> = T extends (infer ArrayItemType)[]
  ? SecondValue<ArrayItemType>[] | Updates<SecondValue<ArrayItemType>>
  : T extends object
  ? { [U in Exclude<keyof T, '_set'>]?: SecondValue<T[U]> } & SetAttribute<T>
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
