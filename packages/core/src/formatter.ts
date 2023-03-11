import chalk from 'chalk'
import _ from 'lodash'

const emptyValues = [null, undefined, '', 'null', 'undefined']
const invalidValues = [...emptyValues, false, 0, 'false', '0']

type LabelType = 'success' | 'warning' | 'error'

interface OptionsPrintLog {
  label: LabelType
}

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

/**
 *
 * @param value
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
 * @returns
 */
export function validateBoolean(value: any): boolean {
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
export function arrayFormatter(value: string | any[]): any[] {
  // check value not empty
  if (!_.isEmpty(value)) {
    // check array value
    if (Array.isArray(value)) {
      return value
    }

    // parse string json to array
    const parseJson = JSON.parse(JSON.stringify(value))

    if (Array.isArray(parseJson)) {
      return parseJson
    }

    return []
  }

  return []
}

/**
 *
 * @param title
 * @param message
 * @param options
 * @returns
 */
export function printLog(
  title: string,
  message: string,
  options?: OptionsPrintLog
): string {
  let newType = ''

  const logName = chalk.green('[server]:')
  const defaultLabel = options?.label ?? 'success'

  if (defaultLabel === 'success') {
    newType = chalk.blue(title)
  } else if (defaultLabel === 'warning') {
    newType = chalk.yellow(title)
  } else if (defaultLabel === 'error') {
    newType = chalk.red(title)
  }

  const newMessage = chalk.green(message)

  const result = `${logName} ${newType} ${newMessage}`

  return result
}
