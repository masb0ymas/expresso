import {
  type ConnectionOptions,
  type IncludeOptions,
  type ModelStatic,
} from 'sequelize'
import type SqlizeQuery from './SqlizeQuery'

export interface ISequelizeOnBeforeBuildQuery {
  paginationQuery: SqlizeQuery
  filteredQuery: SqlizeQuery
  sortedQuery: SqlizeQuery
}

export interface SequelizeQueryOptions {
  onBeforeBuild: (query: ISequelizeOnBeforeBuildQuery) => void
}

export type TSequelizeConnectionOptions = ConnectionOptions & {
  dialect?: string
}

export interface ISequelizeGetFilteredQuery {
  model?: ModelStatic<any>
  prefixName?: string
  options?: TSequelizeConnectionOptions
}

export interface ISequelizeIncludeFilteredQuery {
  filteredValue: any
  model: any
  prefixName: any
  options?: IncludeOptions
}

export interface ISequelizeFilterIncludeHandledOnly {
  include: any
  filteredInclude?: any
}
