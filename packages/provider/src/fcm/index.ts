import { App, AppOptions, initializeApp } from 'firebase-admin/app'
import {
  BatchResponse,
  getMessaging,
  MessagingDevicesResponse,
} from 'firebase-admin/messaging'
import { FCMProviderEntity, SendMulticastFCM, SendToMessageFCM } from './types'

export class FCMProvider {
  private readonly _name?: string
  private readonly _options?: AppOptions

  constructor(params: FCMProviderEntity) {
    this._name = params.name
    this._options = params.options
  }

  /**
   * Initial FCM Provider
   * @returns
   */
  public initialize(): App {
    return initializeApp(this._options, this._name)
  }

  /**
   *
   * @param value
   * @returns
   */
  private _clickToAction(value: string) {
    return `${value}_NOTIFICATION_CLICK`
  }

  /**
   *
   * @param params
   * @returns
   */
  public async sendMulticast(params: SendMulticastFCM): Promise<BatchResponse> {
    const { appName, deviceTokens, title, message, type, data } = params

    const clickAction = this._clickToAction(appName)

    // Send To Devices
    const result = await getMessaging().sendMulticast({
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
  ): Promise<MessagingDevicesResponse> {
    const { appName, deviceTokens, title, message, type, data } = params

    const clickAction = this._clickToAction(appName)

    // Send To Device
    const result = await getMessaging().sendToDevice(deviceTokens, {
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
  public async sendTopics(values: SendToMessageFCM): Promise<string> {
    const { appName, title, message, type, data, topic } = values

    const clickAction = this._clickToAction(appName)

    // Send By Topic
    const result = await getMessaging().send({
      topic: topic || 'all',
      notification: { title, body: message },
      data: { click_action: clickAction, type, data: JSON.stringify(data) },
    })

    return result
  }
}
