import { ms } from 'expresso-core'
import { Redis, type RedisOptions } from 'ioredis'
import { RedisSetOptions } from './types'

export class RedisProvider {
  private readonly _options: RedisOptions

  constructor(options: RedisOptions) {
    this._options = options
  }

  public client(): Redis {
    const client = new Redis(this._options)
    return client
  }

  /**
   * Ping
   * @returns 
   */
  public async ping() {
    const client = this.client()

    const pong = await client.ping((err, result) => {
      if (err) return 'Failed'
      return result
    })

    return pong
  }

  /**
   *
   * @param key
   * @param data
   * @param options
   */
  public async set(
    key: string,
    data: any,
    options?: RedisSetOptions
  ): Promise<void> {
    const client = this.client()

    const defaultTimeout = options?.timeout ?? ms('1d') / 1000

    await client.setex(key, defaultTimeout, JSON.stringify(data))
  }

  /**
   *
   * @param key
   * @returns
   */
  public async get<T>(key: string): Promise<T | null> {
    const client = this.client()

    const data = await client.get(key)

    if (!data) {
      return null
    }

    const parseData = JSON.parse(data) as T
    return parseData
  }

  /**
   *
   * @param key
   */
  public async delete(key: string): Promise<void> {
    const client = this.client()

    await client.del(key)
  }

  /**
   *
   * @param prefix
   */
  public async deleteByPrefix(prefix: string): Promise<void> {
    const client = this.client()

    const keys = await client.keys(`${prefix}:*`)
    const pipeline = client.pipeline()

    keys.forEach((key) => {
      pipeline.del(key)
    })

    await pipeline.exec()
  }
}
