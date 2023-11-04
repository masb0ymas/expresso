interface NumberFormatOptions extends Intl.NumberFormatOptions {
  locale: string
}

export interface CurrencyFormat {
  nominal: string | number
  options?: NumberFormatOptions
}
