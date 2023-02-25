import { SelectQueryBuilder } from 'typeorm'
import sandbox from 'sinon'
import { useQueryTypeORM } from '../src'

describe('query package test', () => {
  test('should query typeorm', () => {
    const anyEntity = 'Test'

    const fakeSelectQueryBuilder =
      sandbox.createStubInstance(SelectQueryBuilder)

    const reqQuery = {
      page: 1,
      pageSize: 10,
    }

    const anyQuery = useQueryTypeORM(
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
