import { _calculatePageSize } from '../../src/typeorm/queryTypeORM'

describe('typeorm calculate pageSize', () => {
  it('should return parsed page size when it is greater than 0 and less than or equal to max limit', () => {
    const pageSize = '50'
    const maxLimit = 100

    const result = _calculatePageSize(pageSize, maxLimit)

    expect(result).toBe(50)
  })

  it('should return minimum limit when parsed page size is less than or equal to 0', () => {
    const pageSize = '-5'
    const maxLimit = 100

    const result = _calculatePageSize(pageSize, maxLimit)

    expect(result).toBe(10)
  })

  it('should return max limit when parsed page size is greater than max limit', () => {
    const pageSize = '150'
    const maxLimit = 100

    const result = _calculatePageSize(pageSize, maxLimit)

    expect(result).toBe(100)
  })

  it('should return minimum limit when page size is not a number or cannot be parsed', () => {
    const pageSize = 'abc'
    const maxLimit = 100

    const result = _calculatePageSize(pageSize, maxLimit)

    expect(result).toBe(10)
  })
})
