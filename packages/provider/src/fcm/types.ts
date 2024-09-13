import { AppOptions } from 'firebase-admin/app'

export interface FCMProviderEntity {
  name?: string
  options?: AppOptions
}

export type FCMSendType = 'all' | 'by-user'

export interface SendToMessageFCM {
  appName: string
  title: string
  message: string
  type: FCMSendType
  data: string
  topic?: string
}

export interface SendMulticastFCM extends SendToMessageFCM {
  deviceTokens: string[]
}
