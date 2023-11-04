import { currency } from '../src'

describe('core currency test', () => {
  it('should return a formatted string with the correct currency symbol and decimal places when given a valid nominal and options object', () => {
    const params = {
      nominal: 1000,
      options: {
        locale: 'en-US',
        currency: 'USD',
      },
    }

    const result = currency.format(params)

    expect(result).toBe('$1,000')
  })

  it('should return a formatted string with the correct currency symbol and decimal places when given a nominal value as a string with leading/trailing whitespace', () => {
    const params = {
      nominal: ' 1000 ',
      options: {
        locale: 'en-US',
        currency: 'USD',
      },
    }

    const result = currency.format(params)

    expect(result).toBe('$1,000')
  })

  test('should format currency IDR', () => {
    const anyValue = '125000'
    const expectValue = 'Rp 125.000'

    const data = currency.format({
      nominal: anyValue,
      options: { locale: 'id-ID', currency: 'IDR' },
    })

    expect(data).toEqual(expectValue)
  })

  test('should format currency', () => {
    const anyValue = '125000'
    const expectValue = '125.000'

    const data = currency.format({ nominal: anyValue })

    expect(data).toEqual(expectValue)
  })
})
