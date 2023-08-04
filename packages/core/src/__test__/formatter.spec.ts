import {
  arrayFormatter,
  isNumeric,
  mappingToArray,
  ms,
  validateBoolean,
  validateEmpty,
  validateNumber,
} from '..'

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

  test('should mapping to array', () => {
    const anyData = [
      {
        id: 1,
        name: 'any name 1',
      },
      {
        id: 2,
        name: 'any name 2',
      },
    ]

    const data = mappingToArray(anyData)

    console.log(data)

    expect(data).not.toBeNull()
  })
})
