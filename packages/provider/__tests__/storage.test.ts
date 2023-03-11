import { Storage } from '../src'
import 'dotenv/config'

describe('storage provider', () => {
  test('should initial storage provider', () => {
    const storageProvider = new Storage({
      provider: 'minio',
      accessKey: String(process.env.STORAGE_ACCESS_KEY),
      secretKey: String(process.env.STORAGE_SECRET_KEY),
      bucket: String(process.env.STORAGE_BUCKET_NAME),
      region: String(process.env.STORAGE_REGION),
      expires: '1d',
    })

    expect(async () => {
      await storageProvider.initialize()
    }).not.toBeNull()
  })
})
