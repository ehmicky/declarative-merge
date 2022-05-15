import { Updates } from 'set-array'

/**
 * Modifies the merge mode. Can be:
 *  - `false` (default): deep merge
 *  - `null`: shallow merge
 *  - `true`: no merge
 */
interface SetAttribute {
  _set?: boolean | null
}

/**
 * The second value has the same shape as the first except:
 *  - Objects can modify the merge mode using a `_set` property
 *  - Arrays can be "updates" objects instead like { [index]: item, ... }
 */
type SecondValue<T> = T extends (infer ArrayItemType)[]
  ? SecondValue<ArrayItemType>[] | Updates<SecondValue<ArrayItemType>>
  : T extends object
  ? { [U in keyof T]?: SecondValue<T[U]> } & SetAttribute
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
