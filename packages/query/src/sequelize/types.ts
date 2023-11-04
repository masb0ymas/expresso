import {
  Includeable,
  Order,
  WhereOptions,
  type ConnectionOptions,
  type IncludeOptions,
  type ModelStatic,
} from 'sequelize'
import { ReqQuery } from '../types'
import type SqlizeQuery from './SqlizeQuery'

export interface SequelizeOnBeforeBuildQuery {
  paginationQuery: SqlizeQuery
  filteredQuery: SqlizeQuery
  sortedQuery: SqlizeQuery
}

export interface SequelizeQueryOptions {
  onBeforeBuild: (query: SequelizeOnBeforeBuildQuery) => void
}

export type SequelizeConnectionOptions = ConnectionOptions & {
  dialect?: string
}

export interface SequelizeGetFilteredQuery {
  model?: ModelStatic<any>
  prefixName?: string
  options?: SequelizeConnectionOptions
}

export interface SequelizeIncludeFilteredQuery {
  filteredValue: any
  model: any
  prefixName: any
  options?: IncludeOptions
}

export interface SequelizeFilterIncludeHandledOnly {
  include: any
  filteredInclude?: any
}

export interface UseQuerySequelize {
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
