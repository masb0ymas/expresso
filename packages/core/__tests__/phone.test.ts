import { Phonenumber } from '../src'

const phone = new Phonenumber({ country: 'ID' })

describe('test phone helper', () => {
  test('should format phone', () => {
    const anyValue = '081234567890'
    const expectValue = '+6281234567890'

    const result = phone.format(anyValue)

    expect(result).toBe(expectValue)
  })

  test('should format whatsapp', () => {
    const anyValue = '081234567890'
    const expectValue = '6281234567890@c.us'

    const result = phone.formatWhatsapp(anyValue)

    expect(result).toBe(expectValue)
  })

  test('should format hide phone', () => {
    const anyValue = '081234567890'
    const expectValue = '+6281234***890'

    const result = phone.hidePhone(anyValue)

    expect(result).toBe(expectValue)
  })
})
