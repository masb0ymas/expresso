import 'dotenv/config'
import { Redis } from '..'

describe('redis provider', () => {
  test('should initial redis', () => {
    const redisProvider = new Redis({
      host: String(process.env.REDIS_HOST),
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
    })

    expect(() => redisProvider.client()).not.toBe(null)
  })
})
