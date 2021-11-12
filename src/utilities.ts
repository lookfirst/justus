import type { Validation, Validator } from './validation'
import { any, constant } from './primitives'

/* ========================================================================== *
 * UTILITY FUNCTIONS                                                          *
 * ========================================================================== */

/** Simple assertion function */
export function assert(what: boolean | undefined, message: string): asserts what {
  if (! what) throw new TypeError(message)
}

/**
 * Return the `Validator` for the given `Validation`.
 *
 * When `validation` is `undefined` it will return a `Validator<any>`,
 */
export function getValidator(validation?: Validation): Validator {
  // Undefined maps to `any`
  if (validation === undefined) return any

  // Constant values
  if (isPrimitive(validation)) return constant(validation)

  // Validator instances (or function creating one)
  if (isFunction(validation)) validation = validation()
  if (isValidator(validation)) return validation

  // Something bad happened!
  throw new TypeError('Invalid validation (no validator???)')
}

/** Type guard for _primitives_ (`boolean`, `string`, `number` or `null`). */
export function isPrimitive(what: any): what is boolean | string | number | null {
  if (what === null) return true
  switch (typeof what) {
    case 'boolean':
    case 'string':
    case 'number':
      return true
    default:
      return false
  }
}

/** Type guard for _functions_. */
export function isFunction(what: any): what is Function {
  return typeof what === 'function'
}

/** Type guard for `Validator` instances. */
export function isValidator(what: any): what is Validator {
  return what &&
    (typeof what === 'object') &&
    ('validate' in what) &&
    (typeof what.validate === 'function')
}
