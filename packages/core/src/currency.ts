interface OptionsFormatEntity extends Intl.NumberFormatOptions {
  locale: string
}

interface CurrencyFormatEntity {
  nominal: string | number
  options?: OptionsFormatEntity
}

/**
 *
 * @param params
 * @returns
 */
export function format(params: CurrencyFormatEntity): string {
  const { nominal, options } = params

  const defaultLocale = options?.locale ?? 'id-ID'
  const defaultCurrency = options?.currency ?? 'IDR'

  if (nominal || Number(nominal)) {
    const data = new Intl.NumberFormat(defaultLocale, {
      style: options?.currency ? 'currency' : undefined,
      currency: options?.currency ? defaultCurrency : undefined,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Number(nominal))

    const result = data.replace(/\u00A0/, ' ')
    return result
  }

  return '-'
}
