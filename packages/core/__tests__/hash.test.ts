import { Hash } from '../src'

const argon = new Hash()
const bcrypt = new Hash('bcrypt')

describe('hash test', () => {
  test('should hash with argon2', async () => {
    const anyText = 'padang123'

    const result = await argon.hash(anyText)

    console.log({ result })

    expect(result).not.toBe(null)
  })

  test('should verify with argon2', async () => {
    const anyText = 'padang123'

    const hashValue = await argon.hash(anyText)
    const compare = await argon.verify(hashValue, anyText)

    console.log({ hashValue, compare })

    expect(compare).toBe(true)
  })
  
  test('should hash with bcrypt', async () => {
    const anyText = 'padang123'

    const result = await bcrypt.hash(anyText)

    console.log({ result })

    expect(result).not.toBe(null)
  })

  test('should verify with bcrypt', async () => {
    const anyText = 'padang123'

    const hashValue = await bcrypt.hash(anyText)
    const compare = await bcrypt.verify(hashValue, anyText)

    console.log({ hashValue, compare })

    expect(compare).toBe(true)
  })
})
