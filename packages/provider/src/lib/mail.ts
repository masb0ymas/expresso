import { green } from 'colorette'
import { type Headers } from 'gaxios'
import { google } from 'googleapis'
import _ from 'lodash'
import nodemailer, {
  type SendMailOptions,
  type SentMessageInfo,
} from 'nodemailer'
import mg from 'nodemailer-mailgun-transport'
import pino from 'pino'

const logger = pino({
  transport: { target: 'pino-pretty', options: { colorize: true } },
})

const msgType = `${green('nodemailer')}`

export type MailDriverType = 'smtp' | 'gmail'

export type MailAuthType = 'OAuth2'

interface MailProviderEntity {
  driver: MailDriverType
  username: string
  password?: string
  from?: string
  host?: string
  port?: number
  appName: string
}

interface MailProviderOptions {
  // Mail Config
  mailType?: MailAuthType
  mailApiKey?: string
  mailDomain?: string

  // OAuth Config
  OAuthClientID?: string
  OAuthClientSecret?: string
  OAuthRefreshToken?: string
  OAuthRedirectURL?: string
}

interface SendMailOptionsEntity {
  dest: string
  subject: string
  text: string
}

export class MailProvider {
  private _mailConfig: SentMessageInfo
  private _mailOptions: SendMailOptions

  private readonly _driver: MailDriverType
  private readonly _username: string
  private readonly _password?: string
  private readonly _from?: string
  private readonly _host?: string
  private readonly _port?: number

  private readonly _appName?: string
  private readonly _mailType?: MailAuthType
  private readonly _mailApiKey?: string
  private readonly _mailDomain?: string

  private readonly _OAuthClientID?: string
  private readonly _OAuthClientSecret?: string
  private readonly _OAuthRefreshToken?: string
  private readonly _OAuthRedirectURL?: string

  private readonly _isMailgunAPI: boolean

  constructor(params: MailProviderEntity, options?: MailProviderOptions) {
    this._mailConfig = {}
    this._mailOptions = {}

    this._driver = params.driver
    this._username = params.username
    this._password = params?.password
    this._from = params?.from
    this._host = params?.host
    this._port = params?.port
    this._appName = params.appName

    this._mailType = options?.mailType
    this._mailApiKey = options?.mailApiKey
    this._mailDomain = options?.mailDomain

    this._OAuthClientID = options?.OAuthClientID
    this._OAuthClientSecret = options?.OAuthClientSecret
    this._OAuthRefreshToken = options?.OAuthRefreshToken
    this._OAuthRedirectURL = options?.OAuthRedirectURL

    this._isMailgunAPI =
      !_.isEmpty(this._mailApiKey) && !_.isEmpty(this._mailDomain)
  }

  /**
   * Set Mail Config
   * @returns
   */
  private _setMailConfig(): SentMessageInfo {
    const configTransport: SentMessageInfo = {
      service: this._driver,
      auth: {
        user: '',
      },
    }

    // Use Google OAuth
    if (this._mailType === 'OAuth2') {
      const oauth2Client = new google.auth.OAuth2(
        this._OAuthClientID,
        this._OAuthClientSecret,
        this._OAuthRedirectURL
      )

      oauth2Client.setCredentials({
        refresh_token: this._OAuthRefreshToken,
      })

      const accessToken = async (): Promise<Headers> => {
        const result = await oauth2Client.getRequestHeaders()
        return result
      }

      configTransport.auth.user = this._username
      configTransport.auth.type = this._mailType
      configTransport.auth.clientId = this._OAuthClientID
      configTransport.auth.clientSecret = this._OAuthClientSecret
      configTransport.auth.refreshToken = this._OAuthRefreshToken
      configTransport.auth.accessToken = accessToken()
    } else if (this._isMailgunAPI) {
      // SMTP with Mailgun API
      configTransport.auth.api_key = this._mailApiKey
      configTransport.auth.domain = this._mailDomain
    } else {
      // SMTP Default
      configTransport.host = this._host
      configTransport.port = this._port
      configTransport.auth.user = this._username
      configTransport.auth.pass = this._password
    }

    return configTransport
  }

  /**
   * Set Mail Options
   * @param params
   * @returns
   */
  private _setMailOptions(params: SendMailOptionsEntity): SendMailOptions {
    const { dest, subject, text } = params

    const mail_from = !_.isEmpty(this._from)
      ? this._from
      : `${this._appName} <${this._username}>`

    const result = {
      from: mail_from,
      to: dest,
      subject,
      html: text,
    }

    return result
  }

  /**
   * Client
   * @returns
   */
  private _client(): SentMessageInfo {
    // mail config
    this._mailConfig = this._isMailgunAPI
      ? mg(this._setMailConfig())
      : this._setMailConfig()

    // Nodemailer Transport
    const transporter = nodemailer.createTransport(this._mailConfig)

    return transporter
  }

  /**
   * Initialize Mail Service
   */
  public initialize(): void {
    // Nodemailer Transport
    const transporter = this._client()

    transporter.verify(function (err: any, success: any) {
      if (err) {
        const message = `${msgType} - ${err.message ?? err}`
        logger.error(message)

        throw new Error(err)
      } else {
        const message = `${msgType} - mail service is ready to take our messages`
        logger.info(message)
      }
    })
  }

  /**
   * Send Mail Config Transporter
   * @param params
   */
  private _sendMail(params: SendMailOptionsEntity): void {
    const { dest, subject, text } = params

    // client
    const transporter = this._client()

    // mail options
    this._mailOptions = this._setMailOptions({ dest, subject, text })

    transporter.sendMail(
      this._mailOptions,
      (err: { message: any }, info: any) => {
        if (err) {
          const errMessage = `something went wrong!, ${err.message ?? err}`

          const message = `${msgType} - ${errMessage}`
          logger.error(message)

          throw new Error(errMessage)
        }

        const message = `${msgType} - success, email has been sent!`
        logger.info(message)
        console.log(message, info)
      }
    )
  }

  /**
   * `Send Mail with Nodemailer`
   * @param to
   * @param subject
   * @param template
   */
  public send(to: string | string[], subject: string, template: string): void {
    const dest: string = Array.isArray(to) ? to.join(',') : to
    const text: string = template

    // send an e-mail
    this._sendMail({ dest, subject, text })
  }
}
