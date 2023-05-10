import { validateNumber } from 'expresso-core'
import _ from 'lodash'
import {
  type DataSourceOptions,
  type ObjectLiteral,
  type SelectQueryBuilder,
} from 'typeorm'
import { validate as uuidValidate } from 'uuid'
import {
  type FilteredQueryEntity,
  type SortedQueryEntity,
  type UseTypeOrmQuery,
} from '../interface'

export function queryBuilder<T extends ObjectLiteral>(
  values: UseTypeOrmQuery<T>,
  options?: DataSourceOptions
): SelectQueryBuilder<T> {
  const { entity, query, reqQuery, options: opt } = values

  const minLimit = 10
  const maxLimit = opt?.limit ?? 1000

  let pageSize = minLimit

  // query pageSize < maxLimit
  if (Number(reqQuery.pageSize) > 0) {
    pageSize = Number(reqQuery.pageSize)
  }

  // query pageSize > maxLimit
  if (Number(reqQuery.pageSize) > maxLimit) {
    pageSize = maxLimit
  }

  // pagination
  const page = Number(reqQuery.page) || 1

  query.skip((page - 1) * pageSize)
  query.take(pageSize)

  // query
  const filtered: any = _.get(reqQuery, 'filtered', '[]')
  const parseFiltered = JSON.parse(filtered) as FilteredQueryEntity[]

  const sorted: any = _.get(reqQuery, 'sorted', '[]')
  const parseSorted = JSON.parse(sorted) as SortedQueryEntity[]

  // check parser filtered
  if (!_.isEmpty(parseFiltered)) {
    for (let i = 0; i < parseFiltered.length; i += 1) {
      const item = parseFiltered[i]

      const check_uuid = uuidValidate(item.value)
      const check_numeric = validateNumber(item.value)
      const expect_numberic_or_uuid = !check_numeric && !check_uuid

      // query connection postgres
      const check_query_like_postgres =
        options?.type === 'postgres' && expect_numberic_or_uuid

      // query connection mysql
      const check_query_like_mysql =
        ['mysql', 'mariadb'].includes(String(options?.type)) &&
        expect_numberic_or_uuid

      // case UUID
      if (check_uuid || check_numeric) {
        // example : query.andWhere('User.RoleId' = :RoleId, { RoleId: 'anyValue' })
        query.andWhere(`${entity}.${item.id} = :${item.id}`, {
          [`${item.id}`]: `${item.value}`,
        })
      }

      // query ILIKE with PostgreSQL
      if (check_query_like_postgres) {
        // example : query.andWhere('User.email' ILIKE :email, { email: '%anyValue%' })
        query.andWhere(`${entity}.${item.id} ILIKE :${item.id}`, {
          [`${item.id}`]: `%${item.value}%`,
        })
      }

      // query LIKE with MySQL or MariaDB
      if (check_query_like_mysql) {
        // example : query.andWhere('User.email' LIKE :email, { email: '%anyValue%' })
        query.andWhere(`${entity}.${item.id} LIKE :${item.id}`, {
          [`${item.id}`]: `%${item.value}%`,
        })
      }
    }
  }

  const orderKey = opt?.orderKey ?? 'createdAt'

  // check parser sorted
  if (!_.isEmpty(parseSorted)) {
    for (let i = 0; i < parseSorted.length; i += 1) {
      const item = parseSorted[i]

      // example : query.addOrderBy('User.email', 'DESC')
      query.addOrderBy(`${entity}.${item.sort}`, item.order)
    }
  } else {
    query.orderBy(`${entity}.${orderKey}`, 'DESC')
  }

  return query
}
