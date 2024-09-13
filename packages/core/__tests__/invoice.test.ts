import { invoice } from '../src'

describe('generate function', () => {
  it('should generate a basic invoice number', () => {
    const result = invoice.generate({
      index: 1,
      startWith: 'INV',
    })
    expect(result).toBe('INV0001')
  })

  it('should use custom length', () => {
    const result = invoice.generate({
      index: 1,
      startWith: 'INV',
      length: 6,
    })
    expect(result).toBe('INV000001')
  })

  it('should handle larger index numbers', () => {
    const result = invoice.generate({
      index: 12345,
      startWith: 'INV',
      length: 6,
    })
    expect(result).toBe('INV012345')
  })

  it('should include date format', () => {
    const result = invoice.generate({
      index: 1,
      startWith: 'INV',
      dateFormat: '20230913',
    })
    expect(result).toBe('INV202309130001')
  })

  it('should use separator', () => {
    const result = invoice.generate({
      index: 1,
      startWith: 'INV',
      dateFormat: '20230913',
      separator: '-',
    })
    expect(result).toBe('INV-20230913-0001')
  })

  it('should handle empty date format', () => {
    const result = invoice.generate({
      index: 1,
      startWith: 'INV',
      dateFormat: '',
      separator: '-',
    })
    expect(result).toBe('INV-0001')
  })

  it('should handle undefined date format', () => {
    const result = invoice.generate({
      index: 1,
      startWith: 'INV',
      separator: '-',
    })
    expect(result).toBe('INV-0001')
  })

  it('should handle index larger than specified length', () => {
    const result = invoice.generate({
      index: 12345,
      startWith: 'INV',
      length: 3,
    })
    expect(result).toBe('INV12345')
  })
})
