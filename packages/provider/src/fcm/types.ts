import * as admin from 'firebase-admin'

export interface FCMProviderEntity {
  name?: string
  options?: admin.AppOptions
}

export type FCMSendType = 'all' | 'by-user'

export interface SendToMessageFCM {
  appName: string
  title: string
  message: string
  type: FCMSendType
  data: string
}

export interface SendMulticastFCM extends SendToMessageFCM {
  deviceTokens: string[]
}
