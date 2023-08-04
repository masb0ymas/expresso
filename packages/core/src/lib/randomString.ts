import _ from 'lodash'
import { isNumeric } from './formatter'

type RandomType = 'alphabet' | 'alphabetNumeric' | 'numeric'

interface GetRandomEntity {
  type?: RandomType
  length?: number
}

const alphabetLower = 'abcdefghijklmnopqrstuvwxyz'
const alphabetUpper = alphabetLower.toUpperCase()
const numeric = '0123456789'

/**
 *
 * @param charString
 * @param length
 * @returns
 */
function _randomCharString(charString: string, length: number): string {
  let result = ''

  const defaultLength = length ?? 32
  const charLength = charString.length

  for (let i = 0; i < defaultLength; i += 1) {
    result += charString.charAt(Math.floor(Math.random() * charLength))
  }

  return result
}

/**
 *
 * @param length
 * @returns
 */
function _randomNumeric(length: number): string {
  let result = ''

  const defaultLength = length ?? 6
  const charLength = numeric.length

  for (let i = 0; i < defaultLength; i += 1) {
    result += numeric[Math.floor(Math.random() * charLength)]
  }

  return result
}

/**
 *
 * @param params
 * @returns
 */
export function generate(params?: number | GetRandomEntity): string {
  let result = ''

  // if params empty
  if (_.isEmpty(params)) {
    const defaultLength = 32
    const charString = `${alphabetLower}${alphabetUpper}${numeric}`

    result = _randomCharString(charString, defaultLength)
  }

  // if params typeof Number
  if (isNumeric(params)) {
    const defaultLength = Number(params) ?? 32
    const charString = `${alphabetLower}${alphabetUpper}${numeric}`

    result = _randomCharString(charString, defaultLength)
  }

  // if params typeof Object
  if (params instanceof Object) {
    const defaultType = params?.type ?? 'alphabetNumeric'

    // String Random
    if (defaultType === 'alphabetNumeric') {
      const defaultLength = params?.length ?? 32

      const charString = `${alphabetLower}${alphabetUpper}${numeric}`

      result = _randomCharString(charString, defaultLength)
    }

    // String Random
    if (defaultType === 'alphabet') {
      const defaultLength = params?.length ?? 32
      const charString = `${alphabetLower}${alphabetUpper}`

      result = _randomCharString(charString, defaultLength)
    }

    // Number Random
    if (defaultType === 'numeric') {
      const defaultLength = params?.length ?? 6

      result = _randomNumeric(defaultLength)
    }
  }

  return result
}
