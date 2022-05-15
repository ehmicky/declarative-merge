import { Updates } from 'set-array'

/**
 *
 * @example
 * ```js
 * ```
 */
export default function partialMerge<T, KeyOpt extends Key = DefaultKey>(
  firstValue: T,
  secondValue: SecondValue<T, KeyOpt extends never ? never : KeyOpt>,
  options?: Options<KeyOpt>,
): T

interface Options<KeyOpt> {
  /**
   * Customize the name of the property used to change the merge mode.
   *
   * @default "_merge"
   */
  key?: KeyOpt
}

/**
 * `key` option's type
 */
type Key = string | symbol

/**
 * `key` option's default value
 */
type DefaultKey = '_merge'

/**
 * The second value has the same shape as the first except:
 *  - Objects can modify the merge mode using a `_merge` property
 *  - Arrays can be "updates" objects instead like { [index]: item, ... }
 */
type SecondValue<T, KeyOpt extends Key> = T extends (infer ArrayItem)[]
  ? SecondValue<ArrayItem, KeyOpt>[] | Updates<SecondValue<ArrayItem, KeyOpt>>
  : T extends object
  ? {
      [Prop in Exclude<keyof T, KeyOpt>]?: SecondValue<T[Prop], KeyOpt>
    } & { [KeyProp in KeyOpt]?: MergeMode }
  : T

/**
 * Modifies the merge mode.
 */
type MergeMode = 'deep' | 'shallow' | 'none'
