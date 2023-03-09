import _ from 'lodash'

/**
 *
 * @param value
 * @returns
 */
export function ms(value: string): number {
  const type = value.replace(/[^a-zA-Z]/g, '') // 7d = d
  const newValue = value.replace(/[^0-9]/g, '') // 7d = 7

  let result = 0

  if (type === 's') {
    result = Number(newValue) * 1000
  }

  if (type === 'm') {
    result = Number(newValue) * 60 * 1000
  }

  if (type === 'h') {
    result = Number(newValue) * 60 * 60 * 1000
  }

  if (type === 'd') {
    result = Number(newValue) * 24 * 60 * 60 * 1000
  }

  return result
}

/**
 *
 * @param value
 * @returns
 */
export function isNumeric(value: any): boolean {
  return !_.isNaN(parseFloat(value)) && _.isFinite(value)
}

/**
 *
 * @param value
 * @returns
 */
export function validateNumber(value: any): number {
  if (isNumeric(Number(value))) {
    return Number(value)
  }

  return 0
}
