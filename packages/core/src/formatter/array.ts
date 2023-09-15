import _ from 'lodash'

/**
 *
 * @param data
 * @returns
 */
export function mappingToArray(data: any[]): any[][] {
  const keys = Object.keys(data[0])
  const result = [keys]

  data.forEach((x) => {
    const value = []

    for (let index = 0; index < keys.length; index += 1) {
      const key = keys[index]
      value.push(x[key])
    }

    result.push(value)
  })

  return result
}

/**
 *
 * @param value
 * @returns
 */
export function arrayFormatter(value: string | any[]): any[] {
  // check value not empty
  if (!_.isEmpty(value)) {
    // check array value
    if (Array.isArray(value)) {
      return value
    }

    // parse string json to array
    const parseJson = JSON.parse(JSON.stringify(value))

    if (Array.isArray(parseJson)) {
      return parseJson
    }

    return []
  }

  return []
}
