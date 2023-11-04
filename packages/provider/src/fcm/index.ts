import * as admin from 'firebase-admin'
import { FCMProviderEntity, SendMulticastFCM, SendToMessageFCM } from './types'

export class FCMProvider {
  private readonly _name?: string
  private readonly _options?: admin.AppOptions

  constructor(params: FCMProviderEntity) {
    this._name = params.name
    this._options = params.options
  }

  /**
   * Initial FCM Provider
   * @returns
   */
  public initialize(): admin.app.App {
    return admin.initializeApp(this._options, this._name)
  }

  /**
   *
   * @param params
   * @returns
   */
  public async sendMulticast(
    params: SendMulticastFCM
  ): Promise<admin.messaging.BatchResponse> {
    const { appName, deviceTokens, title, message, type, data } = params

    const clickAction = `${appName}_NOTIFICATION_CLICK`

    const result = await admin.messaging().sendMulticast({
      tokens: deviceTokens,
      notification: { title, body: message },
      data: { click_action: clickAction, type, data: JSON.stringify(data) },
    })

    return result
  }

  /**
   *
   * @param params
   * @returns
   */
  public async sendToDevice(
    params: SendMulticastFCM
  ): Promise<admin.messaging.MessagingDevicesResponse> {
    const { appName, deviceTokens, title, message, type, data } = params

    const clickAction = `${appName}_NOTIFICATION_CLICK`

    const result = await admin.messaging().sendToDevice(deviceTokens, {
      notification: { title, body: message },
      data: { click_action: clickAction, type, data: JSON.stringify(data) },
    })

    return result
  }

  /**
   *
   * @param values
   * @returns
   */
  public static async sendTopics(values: SendToMessageFCM): Promise<string> {
    const { appName, title, message, type, data } = values

    const clickAction = `${appName}_NOTIFICATION_CLICK`

    const result = await admin.messaging().send({
      topic: 'all',
      notification: { title, body: message },
      data: { click_action: clickAction, type, data: JSON.stringify(data) },
    })

    return result
  }
}
