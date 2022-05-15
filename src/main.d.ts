interface Options {
  /**
   *
   * @example
   * ```js
   * ```
   */
  mutate?: boolean
}

/**
 *
 * @example
 * ```js
 * ```
 */
export default function notDeepMerge<T>(
  firstValue: T,
  secondValue: T,
  options?: Options,
): T
