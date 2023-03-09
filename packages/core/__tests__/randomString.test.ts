import { describe, expect, test } from '@jest/globals'
import { randomString } from '../src'

describe('helpers random string', () => {
  test('should random alphabet', () => {
    const result = randomString.generate()

    expect(result).toHaveLength(32)
  })

  test('should random 10 digit', () => {
    const result = randomString.generate(10)

    expect(result).toHaveLength(10)
  })

  test('should random alphabet', () => {
    const result = randomString.generate({ type: 'alphabet' })

    expect(result).toHaveLength(32)
  })

  test('should random alphabet numeric', () => {
    const result = randomString.generate({ type: 'alphabetNumeric' })

    expect(result).toHaveLength(32)
  })

  test('should random alphabetic with custom length', () => {
    const result = randomString.generate({
      type: 'alphabetNumeric',
      length: 10,
    })

    expect(result).toHaveLength(10)
  })

  test('should random numeric', () => {
    const result = randomString.generate({ type: 'numeric' })

    expect(result).toHaveLength(6)
  })
})
