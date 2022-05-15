import { Updates } from 'set-array'

/**
 * Modifies the merge mode.
 */
type MergeMode = 'deep' | 'shallow' | 'none'

/**
 * The second value has the same shape as the first except:
 *  - Objects can modify the merge mode using a `_merge` property
 *  - Arrays can be "updates" objects instead like { [index]: item, ... }
 */
type SecondValue<T, U extends keyof any> = T extends (infer ArrayItemType)[]
  ? SecondValue<ArrayItemType, U>[] | Updates<SecondValue<ArrayItemType, U>>
  : T extends object
  ? { [V in Exclude<keyof T, U>]?: SecondValue<T[V], U> } & {
      [W in U]?: MergeMode
    }
  : T

type Key = string | symbol
type DefaultKey = '_merge'

/**
 *
 * @example
 * ```js
 * ```
 */
export default function partialMerge<T, U extends Key = DefaultKey>(
  firstValue: T,
  secondValue: SecondValue<T, U extends never ? U : U>,
  /**
   * Customize the name of the property used to change the merge mode.
   *
   * @default "_merge"
   */
  options?: { key?: U },
): T
