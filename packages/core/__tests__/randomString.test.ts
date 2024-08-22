import { randomString } from '../src'

describe('helpers random string', () => {
  // Helper function to check if a string contains only certain characters
  const containsOnly = (str: string, chars: string) =>
    str.split('').every((char) => chars.includes(char))

  const alphabetNumeric =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

  test('generates default string', () => {
    const result = randomString.generate()
    expect(result.length).toBe(32)
    expect(containsOnly(result, alphabetNumeric)).toBe(true)
  })

  test('generates string with custom length', () => {
    const result = randomString.generate(20)
    expect(result.length).toBe(20)
    expect(containsOnly(result, alphabetNumeric)).toBe(true)
  })

  test('generates alphabetNumeric string', () => {
    const result = randomString.generate({
      type: 'alphabetNumeric',
      length: 15,
    })
    expect(result.length).toBe(15)
    expect(containsOnly(result, alphabetNumeric)).toBe(true)
  })

  test('generates alphabet string', () => {
    const result = randomString.generate({ type: 'alphabet', length: 10 })
    expect(result.length).toBe(10)
    expect(containsOnly(result, alphabet)).toBe(true)
  })

  test('generates numeric string', () => {
    const result = randomString.generate({ type: 'numeric', length: 8 })
    expect(result.length).toBe(8)
    expect(containsOnly(result, '0123456789')).toBe(true)
  })

  test('throws error for invalid type', () => {
    expect(() => randomString.generate({ type: 'invalid' as any })).toThrow(
      'Invalid type: invalid'
    )
  })

  test('throws error for invalid params', () => {
    expect(() => randomString.generate('invalid' as any)).toThrow(
      'Invalid params'
    )
  })
})
