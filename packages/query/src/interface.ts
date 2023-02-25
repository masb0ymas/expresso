import { type ObjectLiteral, type SelectQueryBuilder } from 'typeorm'

type SortedType = 'ASC' | 'DESC'

export interface FilteredQueryEntity {
  id: string
  value: string
}

export interface SortedQueryEntity {
  sort: string
  order: SortedType
}

export interface UseQueryEntity<T extends ObjectLiteral> {
  entity: string
  query: SelectQueryBuilder<T>
  reqQuery: Record<any, FilteredQueryEntity | SortedQueryEntity | any>
}
