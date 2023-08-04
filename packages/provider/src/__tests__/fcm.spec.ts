import * as admin from 'firebase-admin'
import path from 'path'
import { FCM } from '..'

describe('fcm provider test', () => {
  test('should initial fcm', () => {
    const serviceAccountPath = path.resolve(
      `${process.cwd()}/public/assets/serviceAccount.json`
    )

    const fcmService = new FCM({
      options: { credential: admin.credential.cert(serviceAccountPath) },
    })

    expect(() => fcmService.initialize()).not.toBe(null)
  })
})
