import { describe, expect, test } from '@jest/globals'
import { randomString } from '../src'

describe('helpers random string', () => {
  test('should random alphabetic', () => {
    const result = randomString.generate({ type: 'alphabetic' })

    expect(result).toHaveLength(32)
  })

  test('should random alphabetic with custom length', () => {
    const result = randomString.generate({ type: 'alphabetic', length: 10 })

    expect(result).toHaveLength(10)
  })

  test('should random numeric', () => {
    const result = randomString.generate({ type: 'numeric' })

    expect(result).toHaveLength(6)
  })
})
