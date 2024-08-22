import _ from 'lodash'

/**
 *
 * @param data
 * @returns
 */
export function mappingToArray(data: Record<string, any>[]): any[][] {
  if (data.length === 0) return []

  const keys = Object.keys(data[0])
  return [keys, ...data.map((item) => keys.map((key) => item[key]))]
}

/**
 *
 * @param value
 * @returns
 */
export function arrayFormatter(value: string | any[]): any[] {
  if (_.isEmpty(value)) return []

  if (Array.isArray(value)) return value

  try {
    const parsedValue = JSON.parse(value as string)
    return Array.isArray(parsedValue) ? parsedValue : []
  } catch {
    return []
  }
}
