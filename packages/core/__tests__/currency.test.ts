import { currency } from '../src'

describe('core currency test', () => {
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
