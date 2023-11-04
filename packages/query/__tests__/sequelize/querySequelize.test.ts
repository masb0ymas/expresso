import { useSequelize } from '../../src'

describe('sequelize query', () => {
  test('should query builder', () => {
    const anyEntity: any = 'Test'

    const reqQuery = {
      page: 1,
      pageSize: 10,
    }

    const anyQuery = useSequelize.queryBulider(
      {
        entity: anyEntity,
        reqQuery,
        includeRule: [],
      },
      { dialect: 'postgres' }
    )

    expect(() => anyQuery).not.toBeUndefined()
  })
})
