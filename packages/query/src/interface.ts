import {
  type Includeable,
  type ModelStatic,
  type Order,
  type WhereOptions,
} from 'sequelize'
import { type ObjectLiteral, type SelectQueryBuilder } from 'typeorm'
import { type SequelizeQueryOptions } from './sequelize/interface'

export type TSort = 'ASC' | 'DESC'

export interface IFilterQuery {
  id: string
  value: string
}

export interface ISortQuery {
  sort: string
  order: TSort
}

export interface ReqQuery {
  filtered?: IFilterQuery[]
  sorted?: ISortQuery[]
  page?: number
  pageSize?: number
  [key: string]: any
}

export interface IOptionsTypeOrmQuery {
  limit?: number
  orderKey?: string
}

export interface IUseTypeOrmQuery<T extends ObjectLiteral> {
  entity: string
  query: SelectQueryBuilder<T>
  reqQuery: ReqQuery
  options?: IOptionsTypeOrmQuery
}

export interface IUseSequelizeQuery {
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
