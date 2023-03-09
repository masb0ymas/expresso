import { isNumeric, ms, validateNumber } from '../src'

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
})
