import { ObjectLiteral, SelectQueryBuilder } from 'typeorm'
import { ReqQuery } from '../types'

export interface TypeOrmQueryOptions {
  limit?: number
  orderKey?: string
}

export interface UseQueryTypeOrm<T extends ObjectLiteral> {
  entity: string
  query: SelectQueryBuilder<T>
  reqQuery: ReqQuery
  options?: TypeOrmQueryOptions
}
