import _ from 'lodash'
import { isNumeric } from '../formatter'
import { GenerateRandom } from './types'

const alphabetLower = 'abcdefghijklmnopqrstuvwxyz'
const alphabetUpper = alphabetLower.toUpperCase()
const numeric = '0123456789'

/**
 *
 * @param charString
 * @param length
 * @returns
 */
function _randomCharString(charString: string, length: number = 32): string {
  return Array.from(
    { length },
    () => charString[Math.floor(Math.random() * charString.length)]
  ).join('')
}

/**
 *
 * @param length
 * @returns
 */
function _randomNumeric(length: number = 6): string {
  return Array.from(
    { length },
    () => numeric[Math.floor(Math.random() * numeric.length)]
  ).join('')
}

/**
 *
 * @param params
 * @returns
 */
export function generate(params?: number | GenerateRandom): string {
  const defaultLength = 32
  const allChars = `${alphabetLower}${alphabetUpper}${numeric}`

  if (isNumeric(params)) {
    return _randomCharString(allChars, Number(params) || defaultLength)
  }

  if (_.isEmpty(params)) {
    return _randomCharString(allChars, defaultLength)
  }

  if (params instanceof Object) {
    const { type = 'alphabetNumeric', length } = params

    switch (type) {
      case 'alphabetNumeric':
        return _randomCharString(allChars, length || defaultLength)
      case 'alphabet':
        return _randomCharString(
          `${alphabetLower}${alphabetUpper}`,
          length || defaultLength
        )
      case 'numeric':
        return _randomNumeric(length || 6)
      default:
        throw new Error(`Invalid type: ${type}`)
    }
  }

  throw new Error('Invalid params')
}
