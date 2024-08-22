import { arrayFormatter, isNumeric, mappingToArray, ms, validate } from '../src'

describe('formatter test', () => {
  test('throws error for invalid time unit', () => {
    expect(() => ms('5x')).toThrow('Invalid time format')
  })

  test('throws error for invalid numeric value', () => {
    expect(() => ms('abc5s')).toThrow('Invalid time format')
  })

  test('throws error for empty string', () => {
    expect(() => ms('')).toThrow('Invalid time format')
  })

  it(`should return the correct value when passed a string in the format of 'Xs'`, () => {
    expect(ms('5s')).toBe(5000)
    expect(ms('10s')).toBe(10000)
    expect(ms('60s')).toBe(60000)
  })

  it(`should return the correct value when passed a string in the format of 'Xm'`, () => {
    expect(ms('1m')).toBe(60000)
    expect(ms('5m')).toBe(300000)
    expect(ms('60m')).toBe(3600000)
  })

  it('should return true when value is a numeric value', () => {
    expect(isNumeric(123)).toBe(true)
    expect(isNumeric(0)).toBe(true)
    expect(isNumeric(-456)).toBe(true)
    expect(isNumeric(3.14)).toBe(true)
  })

  it('should return false when value is a non-numeric value', () => {
    expect(isNumeric('abc')).toBe(false)
    expect(isNumeric(true)).toBe(false)
    expect(isNumeric([])).toBe(false)
    expect(isNumeric({})).toBe(false)
  })

  it('should return a number when given a valid numeric string', () => {
    const result = validate.number('123')
    expect(result).toBe(123)
  })

  it('should return 0 when given a non-numeric string', () => {
    const result = validate.number('abc')
    expect(result).toBe(0)
  })

  it('should return 0 when given a null value', () => {
    const result = validate.number(null)
    expect(result).toBe(0)
  })

  it('should return 0 when given undefined', () => {
    const result = validate.number(undefined)
    expect(result).toBe(0)
  })

  it('should return a number when given a valid numeric string, validate.number', () => {
    const result = validate.number('123')
    expect(result).toBe(123)
  })

  it('should return 0 when given a non-numeric string, validate.number', () => {
    const result = validate.number('abc')
    expect(result).toBe(0)
  })

  it('should return 0 when given a null value, validate.number', () => {
    const result = validate.number(null)
    expect(result).toBe(0)
  })

  it('should return 0 when given undefined, validate.number', () => {
    const result = validate.number(undefined)
    expect(result).toBe(0)
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

  it('should return the input value when it is not included in the emptyValues array', () => {
    const value = 5
    const result = validate.empty(value)
    expect(result).toBe(value)
  })

  it('should return null when the input value is null', () => {
    const value = null
    const result = validate.empty(value)
    expect(result).toBeNull()
  })

  it('should return null when the input value is undefined', () => {
    const value = undefined
    const result = validate.empty(value)
    expect(result).toBeNull()
  })

  it('should return the input value when it is not included in the emptyValues array, validate.empty', () => {
    const value = 5
    const result = validate.empty(value)
    expect(result).toBe(value)
  })

  it('should return null when the input value is null, validate.empty', () => {
    const value = null
    const result = validate.empty(value)
    expect(result).toBeNull()
  })

  it('should return null when the input value is undefined, validate.empty', () => {
    const value = undefined
    const result = validate.empty(value)
    expect(result).toBeNull()
  })

  test('should validateBoolean', () => {
    const anyValue = 'true'

    const data = validate.boolean(anyValue)

    expect(data).toBe(true)
  })

  test('should validate.boolean', () => {
    const anyValue = 'true'

    const data = validate.boolean(anyValue)

    expect(data).toBe(true)
  })

  test('should right value validate.date', () => {
    const anyValue = '2024-01-01'

    const data = validate.isDate(anyValue)

    expect(data).toBe(true)
  })

  test('should wrong value validate.date', () => {
    const anyValue = null

    const data = validate.isDate(anyValue)

    expect(data).toBe(false)
  })

  it('should return an array of arrays with the same length as the input array', () => {
    const data = [
      { name: 'John', age: 25 },
      { name: 'Jane', age: 30 },
    ]
    const result = mappingToArray(data)

    expect(result.length).toBe(3)
  })

  it('should return an array of arrays with the same values as the input object properties', () => {
    const data = [
      { name: 'John', age: 25 },
      { name: 'Jane', age: 30 },
    ]
    const result = mappingToArray(data)

    expect(result[1]).toEqual(Object.values(data[0]))
    expect(result[2]).toEqual(Object.values(data[1]))
  })

  it('should throw an error when input array is null', () => {
    const data = null

    // @ts-expect-error
    expect(() => mappingToArray(data)).toThrow()
  })
})
