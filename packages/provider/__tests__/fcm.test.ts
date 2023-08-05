import * as admin from 'firebase-admin'
import path from 'path'
import { FCM } from '../src'

describe('fcm provider test', () => {
  const serviceAccountPath = path.resolve(
    `${__dirname}/../../../serviceAccount.json`
  )

  test('should initial fcm', () => {
    const fcmService = new FCM({
      options: { credential: admin.credential.cert(serviceAccountPath) },
    })

    expect(() => fcmService.initialize()).not.toBe(null)
  })
})
