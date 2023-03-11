import {
  arrayFormatter,
  isNumeric,
  ms,
  printLog,
  validateBoolean,
  validateEmpty,
  validateNumber,
} from '../src'

describe('formatter test', () => {
  test('should convert ms', () => {
    const expectValue = 24 * 60 * 60 * 1000

    const data = ms('1d')

    expect(data).toBe(expectValue)
  })

  test('should is numeric', () => {
    const anyValue = 10

    const data = isNumeric(anyValue)

    expect(data).toBe(true)
  })

  test('should validate number', () => {
    const anyValue = '10'

    const data = validateNumber(anyValue)

    expect(data).toBe(10)
  })

  test('should array formatter', () => {
    const anyArray = [
      { id: 1, name: 'anyName' },
      { id: 2, name: 'anyName' },
    ]

    const jsonArray = JSON.parse(JSON.stringify(anyArray))
    const data = arrayFormatter(jsonArray)

    expect(data).toBe(jsonArray)
  })

  test('should validate empty', () => {
    const anyValue = 'null'

    const data = validateEmpty(anyValue)

    expect(data).toBe(null)
  })

  test('should validate boolean', () => {
    const anyValue = 'true'

    const data = validateBoolean(anyValue)

    expect(data).toBe(true)
  })

  test('should log server', () => {
    const anyTitle = 'anyTitle'
    const anyMessage = 'anyMessage'

    const logMessage = printLog(anyTitle, anyMessage)

    const expectValue = `\x1B[32m[server]:\x1B[39m \x1B[34manyTitle\x1B[39m \x1B[32manyMessage\x1B[39m`

    expect(logMessage).toBe(expectValue)
  })

  test('should log warning server', () => {
    const anyTitle = 'anyTitle'
    const anyMessage = 'anyMessage'

    const logMessage = printLog(anyTitle, anyMessage, { label: 'warning' })

    const expectValue = `\x1B[32m[server]:\x1B[39m \x1B[33manyTitle\x1B[39m \x1B[32manyMessage\x1B[39m`

    expect(logMessage).toBe(expectValue)
  })

  test('should log error server', () => {
    const anyTitle = 'anyTitle'
    const anyMessage = 'anyMessage'

    const logMessage = printLog(anyTitle, anyMessage, { label: 'error' })

    const expectValue = `\x1B[32m[server]:\x1B[39m \x1B[31manyTitle\x1B[39m \x1B[32manyMessage\x1B[39m`

    expect(logMessage).toBe(expectValue)
  })
})
