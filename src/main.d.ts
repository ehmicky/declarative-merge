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
type SecondValue<T> = {
  [U in keyof T]?: T[U] extends (infer ArrayItemType)[]
    ? T[U] | Updates<ArrayItemType>
    : T[U] extends object
    ? SecondValue<T[U]> & SetAttribute
    : T[U]
}

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
