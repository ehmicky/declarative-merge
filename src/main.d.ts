import { Updates } from 'set-array'

type MergeValue = 'deep' | 'shallow' | 'none'

/**
 * Modifies the merge mode. Can be `"deep"` (default), `"shallow"` or `"none"`.
 */
interface MergeAttribute {
  _merge?: MergeValue
}

/**
 * The second value has the same shape as the first except:
 *  - Objects can modify the merge mode using a `_merge` property
 *  - Arrays can be "updates" objects instead like { [index]: item, ... }
 */
type SecondValue<T> = T extends (infer ArrayItemType)[]
  ? SecondValue<ArrayItemType>[] | Updates<SecondValue<ArrayItemType>>
  : T extends object
  ? { [U in Exclude<keyof T, '_merge'>]?: SecondValue<T[U]> } & MergeAttribute
  : T

interface Options {
  /**
   * Customize the name of the property used to change the merge mode.
   *
   * @default "_merge"
   */
  key?: string | symbol
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
  options?: Options,
): T
