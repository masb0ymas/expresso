import { validate } from 'expresso-core'
import _ from 'lodash'
import {
  type DataSourceOptions,
  type ObjectLiteral,
  type SelectQueryBuilder,
} from 'typeorm'
import { validate as uuidValidate } from 'uuid'
import { QueryFiltered, QuerySorted } from '../types'
import { UseQueryTypeOrm } from './types'

/**
 *
 * @param pageSize
 * @param maxLimit
 * @returns
 */
export function _calculatePageSize(
  pageSize: string | number,
  maxLimit: number
): number {
  const minLimit = 10
  const parsedPageSize = validate.number(pageSize)

  if (parsedPageSize > 0) {
    return Math.min(parsedPageSize, maxLimit)
  }

  return minLimit
}

/**
 *
 * @param query
 * @param page
 * @param pageSize
 */
export function _applyPagination<T extends ObjectLiteral>(
  query: SelectQueryBuilder<T>,
  page: string | number,
  pageSize: number
): void {
  const parsedPage = validate.number(page) || 1

  if (pageSize <= 0) {
    pageSize = 10
  }

  query.skip((parsedPage - 1) * pageSize)
  query.take(pageSize)
}

/**
 *
 * @param query
 * @param entity
 * @param filtered
 * @param options
 */
function _applyFilters<T extends ObjectLiteral>(
  query: SelectQueryBuilder<T>,
  entity: string,
  filtered: string,
  options?: DataSourceOptions
) {
  const parsedFiltered = JSON.parse(filtered) as QueryFiltered[]

  if (!_.isEmpty(parsedFiltered)) {
    for (let i = 0; i < parsedFiltered.length; i += 1) {
      const item = parsedFiltered[i]

      const check_uuid = uuidValidate(item.value)
      const check_numeric = validate.number(item.value)
      const expect_numberic_or_uuid = !check_numeric && !check_uuid

      const check_query_like_postgres =
        options?.type === 'postgres' && expect_numberic_or_uuid

      const check_query_like_mysql =
        ['mysql', 'mariadb'].includes(String(options?.type)) &&
        expect_numberic_or_uuid

      if (check_uuid || check_numeric) {
        query.andWhere(`${entity}.${item.id} = :${item.id}`, {
          [`${item.id}`]: `${item.value}`,
        })
      }

      if (check_query_like_postgres) {
        query.andWhere(`${entity}.${item.id} ILIKE :${item.id}`, {
          [`${item.id}`]: `%${item.value}%`,
        })
      }

      if (check_query_like_mysql) {
        query.andWhere(`${entity}.${item.id} LIKE :${item.id}`, {
          [`${item.id}`]: `%${item.value}%`,
        })
      }
    }
  }
}

/**
 *
 * @param query
 * @param entity
 * @param sorted
 * @param orderKey
 */
function _applySorting<T extends ObjectLiteral>(
  query: SelectQueryBuilder<T>,
  entity: string,
  sorted: string,
  orderKey?: string
): void {
  const parsedSorted = JSON.parse(sorted) as QuerySorted[]

  if (!_.isEmpty(parsedSorted)) {
    for (let i = 0; i < parsedSorted.length; i += 1) {
      const item = parsedSorted[i]
      query.addOrderBy(`${entity}.${item.sort}`, item.order)
    }
  } else {
    query.orderBy(`${entity}.${orderKey ?? 'createdAt'}`, 'DESC')
  }
}

/**
 * Create Query Builder TypeORM
 * @param values
 * @param options
 * @returns
 */
export function queryBuilder<T extends ObjectLiteral>(
  values: UseQueryTypeOrm<T>,
  options?: DataSourceOptions
): SelectQueryBuilder<T> {
  const { entity, query, reqQuery, options: opt } = values

  const maxLimit = opt?.limit || 1000

  const queryPage = _.get(reqQuery, 'page', 0)
  const queryPageSize = _.get(reqQuery, 'pageSize', 10)
  const queryFiltered: any = _.get(reqQuery, 'filtered', '[]')
  const querySorted: any = _.get(reqQuery, 'sorted', '[]')

  // calculate page size
  const pageSize = _calculatePageSize(queryPageSize, maxLimit)

  // apply pagination
  _applyPagination(query, queryPage, pageSize)

  // apply filters
  _applyFilters(query, entity, queryFiltered, options)

  // apply sorting
  _applySorting(query, entity, querySorted, opt?.orderKey)

  return query
}
