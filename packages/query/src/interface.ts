import { type Includeable, type ModelStatic } from 'sequelize'
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
}

export interface UseSequelizeQuery {
  entity: ModelStatic<any>
  reqQuery: ReqQuery
  includeRule?: Includeable | Includeable[]
  options?: SequelizeQueryOptions
}
