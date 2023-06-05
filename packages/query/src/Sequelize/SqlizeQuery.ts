import {
  DataTypes,
  Model,
  type IncludeOptions,
  type Includeable,
} from 'sequelize'
import { QueryHelper } from './QueryHelper'
import { TransformHelper } from './TransformHelper'

type TValueParsers = (value: any) => any
type TTransformBuild = (value: any, transformHelper: TransformHelper) => any
type TQueryBuilders = (value: any, queryHelper: QueryHelper) => any

type TCustomIncludeOptions = IncludeOptions & { key?: string }
type TOnBuildInclude = (value: TCustomIncludeOptions) => TCustomIncludeOptions

/**
 *
 * @param dataType
 * @returns
 */
export function getPrimitiveDataType<T>(dataType: T): 'string' | 0 {
  const findDataType = (item: any): any => dataType instanceof item

  if (
    [
      DataTypes.JSON,
      DataTypes.TEXT,
      DataTypes.STRING,
      DataTypes.UUID,
      DataTypes.UUIDV1,
      DataTypes.UUIDV4,
    ].find(findDataType)
  ) {
    return 'string'
  }

  if (
    [
      DataTypes.REAL,
      DataTypes.INTEGER,
      DataTypes.FLOAT,
      DataTypes.BIGINT,
      DataTypes.DECIMAL,
      DataTypes.DOUBLE,
      DataTypes.MEDIUMINT,
      DataTypes.NUMBER,
      DataTypes.SMALLINT,
      DataTypes.TINYINT,
    ].find(findDataType)
  ) {
    return 0
  }

  // DataTypes.STRING
  // DataTypes.CHAR
  // DataTypes.TEXT
  // DataTypes.NUMBER
  // DataTypes.TINYINT
  // DataTypes.SMALLINT
  // DataTypes.MEDIUMINT
  // DataTypes.INTEGER
  // DataTypes.BIGINT
  // DataTypes.FLOAT
  // DataTypes.REAL
  // DataTypes.DOUBLE
  // DataTypes.DECIMAL
  // DataTypes.BOOLEAN
  // DataTypes.TIME
  // DataTypes.DATE
  // DataTypes.DATEONLY
  // DataTypes.HSTORE
  // DataTypes.JSON
  // DataTypes.JSONB
  // DataTypes.NOW
  // DataTypes.BLOB
  // DataTypes.RANGE
  // DataTypes.UUID
  // DataTypes.UUIDV1
  // DataTypes.UUIDV4
  // DataTypes.VIRTUAL
  // DataTypes.ENUM
  // DataTypes.ARRAY
  // DataTypes.GEOMETRY
  // DataTypes.GEOGRAPHY
  // DataTypes.CIDR
  // DataTypes.INET
  // DataTypes.MACADDR
  // DataTypes.CITEXT
  // if([
  //   DataTypes.NUMBER
  // ])

  // default is string
  return 'string'
}

/**
 *
 * @param includes
 * @param TOnBuildInclude
 * @returns
 */
export function transfromIncludeToQueryable(
  includes: Includeable[],
  onBuildInclude?: TOnBuildInclude
): TCustomIncludeOptions[] {
  const result = [] as TCustomIncludeOptions[]
  const _onBuildInclude =
    onBuildInclude ??
    function (value: TCustomIncludeOptions) {
      return value
    }

  /**
   *
   * @param includes
   * @param parent
   */
  function wrapFiltered(
    includes: Includeable[],
    parent?: IncludeOptions
  ): void {
    for (let i = 0; i < includes.length; i += 1) {
      const include = includes[i] as TCustomIncludeOptions

      // eslint-disable-next-line no-unused-vars
      const { model, key, include: oriInclude, ...restInclude } = include

      // TODO: fix compare isTypeModel for better check typing
      const isTypeModel = typeof Model === typeof include
      const curModel = (isTypeModel ? include : model) as typeof Model
      const defaultName = curModel.options.name?.singular
      const data = _onBuildInclude({
        ...(isTypeModel ? {} : restInclude),
        key: key ?? defaultName,
        model: curModel,
      } as unknown as IncludeOptions)

      if (parent) {
        // eslint-disable-next-line no-param-reassign
        parent.include = parent.include ?? []
        parent.include.push(data)
      } else {
        result.push(data)
      }

      if (include.include) {
        wrapFiltered(include.include, data)
      }
    }
  }

  wrapFiltered(includes)
  return result
}

/**
 * Sqlize Query
 */
export default class SqlizeQuery {
  private readonly _valueParsers: TValueParsers[] = []

  private readonly _transformBuilds: TTransformBuild[] = []

  private readonly _queryBuilders: TQueryBuilders[] = []

  public addValueParser(fn: TValueParsers): void {
    this._valueParsers.push(fn)
  }

  public addQueryBuilder(fn: TQueryBuilders): void {
    this._queryBuilders.push(fn)
  }

  public addTransformBuild(fn: TTransformBuild): void {
    this._transformBuilds.push(fn)
  }

  public build(value: any): any {
    let parserValue = value as any[]
    for (let i = 0; i < this._valueParsers.length; i += 1) {
      const getterValue = this._valueParsers[i]
      parserValue = getterValue(value)
    }

    const queryHelper = new QueryHelper(parserValue)
    // executed queryBuilder min 1, when parserValue no data
    for (let i = 0; i < (parserValue.length || 1); i += 1) {
      const valueP = parserValue[i]
      for (let k = 0; k < this._queryBuilders.length; k += 1) {
        const queryBuilder = this._queryBuilders[k]
        queryBuilder(valueP, queryHelper)
      }
    }

    const result = queryHelper.getQuery()
    const transformHelper = new TransformHelper(result)
    for (let i = 0; i < this._transformBuilds.length; i += 1) {
      const transformBuild = this._transformBuilds[i]
      transformBuild(result, transformHelper)
    }

    return transformHelper.getValue()
  }
}
