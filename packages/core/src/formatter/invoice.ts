import _ from 'lodash'

interface InvoiceEntity {
  index: number
  startWith: string
  length?: number
  dateFormat?: string
  separator?: string
}

/**
 *
 * @param params
 * @returns
 */
export function generate({
  index,
  startWith,
  length = 4,
  dateFormat,
  separator,
}: InvoiceEntity) {
  const digitLength = length
  let digitPosition = digitLength - String(index).length

  let maxRepeat = 10

  if (digitPosition > 10) {
    digitPosition = maxRepeat
  } else if (digitPosition <= 0) {
    digitPosition = 0
  }

  const repeatZero = '0'.repeat(digitPosition)
  const increment = `${repeatZero}${index}`

  let middleCode = ''
  let arrayString = []

  if (!_.isNil(dateFormat) && !_.isEmpty(dateFormat)) {
    middleCode = dateFormat
  }

  arrayString = [startWith, middleCode, increment]
  let result = _.compact(arrayString).join('')

  if (separator) {
    result = _.compact(arrayString).join(separator)
  }

  return result
}
