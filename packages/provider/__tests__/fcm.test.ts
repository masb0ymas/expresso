import { FCM } from '../src'
import * as admin from 'firebase-admin'
import path from 'path'

describe('fcm provider test', () => {
  test('should initial fcm', () => {
    const serviceAccountPath = path.resolve(
      `${__dirname}/../serviceAccount.json`
    )

    const fcmService = new FCM({
      options: { credential: admin.credential.cert(serviceAccountPath) },
    })

    expect(() => fcmService.initialize()).not.toBe(null)
  })
})
