import { SelectQueryBuilder } from 'typeorm'
import {
  _applyPagination,
  _calculatePageSize,
  queryBuilder,
} from '../../src/typeorm/queryTypeORM' // Replace with the actual file name

// Mock the external dependencies
jest.mock('expresso-core', () => ({
  validate: {
    number: jest.fn((value) => Number(value)),
  },
}))

jest.mock('uuid', () => ({
  validate: jest.fn(),
}))

describe('Query Builder Functions', () => {
  describe('_calculatePageSize', () => {
    it('should return the correct page size when input is within limits', () => {
      expect(_calculatePageSize('20', 100)).toBe(20)
    })

    it('should return the max limit when input exceeds it', () => {
      expect(_calculatePageSize('150', 100)).toBe(100)
    })

    it('should return the min limit when input is invalid', () => {
      expect(_calculatePageSize('invalid', 100)).toBe(10)
    })
  })

  describe('_applyPagination', () => {
    let mockQuery: Partial<SelectQueryBuilder<any>>

    beforeEach(() => {
      mockQuery = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
      }
    })

    it('should apply correct pagination for valid input', () => {
      _applyPagination(mockQuery as SelectQueryBuilder<any>, '2', 10)
      expect(mockQuery.skip).toHaveBeenCalledWith(10)
      expect(mockQuery.take).toHaveBeenCalledWith(10)
    })

    it('should use default values for invalid input', () => {
      _applyPagination(mockQuery as SelectQueryBuilder<any>, 'invalid', 0)
      expect(mockQuery.skip).toHaveBeenCalledWith(0)
      expect(mockQuery.take).toHaveBeenCalledWith(10)
    })
  })

  describe('queryBuilder', () => {
    let mockQuery: any
    let mockOptions: any

    beforeEach(() => {
      mockQuery = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
      }

      mockOptions = {
        type: 'postgres',
      }
    })

    it('should apply all query modifications correctly', () => {
      const values = {
        entity: 'user',
        query: mockQuery,
        reqQuery: {
          page: '2',
          pageSize: '20',
          filtered: JSON.stringify([{ id: 'name', value: 'John' }]),
          sorted: JSON.stringify([{ sort: 'name', order: 'ASC' }]),
        },
        options: { limit: 100 },
      }

      // @ts-expect-error
      queryBuilder(values, mockOptions)

      expect(mockQuery.skip).toHaveBeenCalled()
      expect(mockQuery.take).toHaveBeenCalled()
      expect(mockQuery.andWhere).toHaveBeenCalled()
      expect(mockQuery.addOrderBy).toHaveBeenCalled()
    })

    it('should use default values when query parameters are missing', () => {
      const values = {
        entity: 'user',
        query: mockQuery,
        reqQuery: {},
        options: {},
      }

      queryBuilder(values, mockOptions)

      expect(mockQuery.skip).toHaveBeenCalledWith(0)
      expect(mockQuery.take).toHaveBeenCalledWith(10)
      expect(mockQuery.orderBy).toHaveBeenCalledWith('user.createdAt', 'DESC')
    })
  })
})
