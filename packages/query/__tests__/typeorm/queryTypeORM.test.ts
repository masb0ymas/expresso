import sandbox from 'sinon'
import { SelectQueryBuilder } from 'typeorm'
import { useTypeOrm } from '../../src'
import { _calculatePageSize } from '../../src/typeorm/queryTypeORM'

describe('query package test', () => {
  test('should query typeorm', () => {
    const anyEntity = 'Test'

    const fakeSelectQueryBuilder =
      sandbox.createStubInstance(SelectQueryBuilder)

    const reqQuery = {
      page: 1,
      pageSize: 10,
    }

    const anyQuery = useTypeOrm.queryBuilder(
      {
        entity: anyEntity,
        query: fakeSelectQueryBuilder,
        reqQuery,
      },
      { type: 'postgres' }
    )

    expect(() => anyQuery).not.toBeUndefined()
  })
})
