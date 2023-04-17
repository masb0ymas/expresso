import {
  type Includeable,
  type ModelStatic,
  type Order,
  type WhereOptions,
} from 'sequelize'
import { type ObjectLiteral, type SelectQueryBuilder } from 'typeorm'
import { type SequelizeQueryOptions } from './Sequelize/interface'

type SortedType = 'ASC' | 'DESC'

export interface FilteredQueryEntity {
  id: string
  value: string
}

export interface SortedQueryEntity {
  sort: string
  order: SortedType
}

export interface ReqQuery {
  filtered?: FilteredQueryEntity[]
  sorted?: SortedQueryEntity[]
  page?: number
  pageSize?: number
  [key: string]: any
}

export interface UseTypeOrmQuery<T extends ObjectLiteral> {
  entity: string
  query: SelectQueryBuilder<T>
  reqQuery: ReqQuery
  limit?: number
}

export interface UseSequelizeQuery {
  entity: ModelStatic<any>
  reqQuery: ReqQuery
  includeRule?: Includeable | Includeable[]
  limit?: number
  options?: SequelizeQueryOptions
}

export interface DtoSequelizeQuery {
  include: Includeable | Includeable[]
  includeCount: Includeable | Includeable[]
  where: WhereOptions
  order: Order
  offset: number
  limit: number
}
