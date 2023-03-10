import * as admin from 'firebase-admin'

interface FCMProviderEntity {
  name?: string
  options?: admin.AppOptions
}

type SendingType = 'all' | 'by-user'

interface sendToMessageAttributes {
  appName: string
  title: string
  message: string
  type: SendingType | string
  data: string
}

interface sendMulticastAttributes extends sendToMessageAttributes {
  deviceTokens: string[]
}

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
  public initial(): admin.app.App {
    return admin.initializeApp(this._options, this._name)
  }

  /**
   *
   * @param params
   * @returns
   */
  public async sendMulticast(
    params: sendMulticastAttributes
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
    params: sendMulticastAttributes
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
  public static async sendTopics(
    values: sendToMessageAttributes
  ): Promise<string> {
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
