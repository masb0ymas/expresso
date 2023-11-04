/**
 *
 * @param value
 * @returns
 */
export function ms(value: string): number {
  const SECONDS_IN_MS = 1000
  const MINUTES_IN_MS = 60 * SECONDS_IN_MS
  const HOURS_IN_MS = 60 * MINUTES_IN_MS
  const DAYS_IN_MS = 24 * HOURS_IN_MS

  // Extract the type from the value (e.g., 'd' for days)
  const type = value.replace(/[^a-zA-Z]/g, '') // 7d = d

  // Extract the numeric value from the string (e.g., '7' for 7 days)
  const newValue = value.replace(/[^0-9]/g, '') // 7d = 7

  let result = 0

  // Convert the value to milliseconds based on the type
  const numericValue = Number(newValue)

  if (type === 's') {
    result = numericValue * SECONDS_IN_MS
  }

  if (type === 'm') {
    result = numericValue * MINUTES_IN_MS
  }

  if (type === 'h') {
    result = numericValue * HOURS_IN_MS
  }

  if (type === 'd') {
    result = numericValue * DAYS_IN_MS
  }

  return result
}
