import { isValid } from 'date-fns'
import { isNumeric } from './number'

const emptyValues = [null, undefined, '', 'null', 'undefined']
const invalidValues = [...emptyValues, false, 0, 'false', '0']

/**
 *
 * @param value
 * @deprecated move to validate.number
 * @returns
 */
export function validateNumber(value: any): number {
  if (isNumeric(Number(value))) {
    return Number(value)
  }

  return 0
}

/**
 *
 * @param value
 * @deprecated move to validate.empty
 * @returns
 */
export function validateEmpty(value: any): any {
  if (emptyValues.includes(value)) {
    return null
  }

  return value
}

/**
 *
 * @param value
 * @deprecated move to validate.boolean
 * @returns
 */
export function validateBoolean(value: any): boolean {
  if (invalidValues.includes(value)) {
    return false
  }

  return true
}

export class validate {
  /**
   *
   * @param value
   * @returns
   */
  public static number(value: any) {
    if (isNumeric(Number(value))) {
      return Number(value)
    }

    return 0
  }

  /**
   *
   * @param value
   * @returns
   */
  public static empty(value: any): any {
    if (emptyValues.includes(value)) {
      return null
    }

    return value
  }

  /**
   *
   * @param value
   * @returns
   */
  public static boolean(value: any): boolean {
    if (invalidValues.includes(value)) {
      return false
    }

    return true
  }

  /**
   *
   * @param value
   * @returns
   */
  public static isDate(value: string | number | Date | null): boolean {
    if (value == null) {
      return false
    }

    const valueDate = value instanceof Date ? value : new Date(value)
    return isValid(valueDate)
  }
}
