import { green, red } from 'colorette'
import { logger } from 'expresso-core'
import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import { MailConfig, SendMailOptions } from './types'

const msgType = `${green('nodemailer')}`
const errMsgType = `${red('nodemailer')}`

export class SMTPProvider {
  private readonly _config: MailConfig
  private readonly _transport:
    | string
    | SMTPTransport
    | SMTPTransport.Options
    | undefined
  private readonly _defaults: SMTPTransport.Options | undefined

  constructor(
    config: MailConfig,
    transport?: string | SMTPTransport | SMTPTransport.Options | undefined,
    defaults?: SMTPTransport.Options | undefined
  ) {
    this._config = config
    this._transport = transport
    this._defaults = defaults
  }

  /**
   * Set Mail Config
   * @returns
   */
  // private _setMailConfig(): nodemailer.SentMessageInfo {
  //   const configTransport: nodemailer.SentMessageInfo = {
  //     service: this._driver,
  //     auth: {
  //       user: '',
  //     },
  //   }

  //   // Use Google OAuth
  //   if (this._driver === 'gmail' && this._mailType === 'OAuth2') {
  //     const oauth2Client = new google.auth.OAuth2(
  //       this._OAuthClientID,
  //       this._OAuthClientSecret,
  //       this._OAuthRedirectURL
  //     )

  //     oauth2Client.setCredentials({
  //       refresh_token: this._OAuthRefreshToken,
  //     })

  //     const accessToken = async (): Promise<Headers> => {
  //       const result = await oauth2Client.getRequestHeaders()
  //       return result
  //     }

  //     configTransport.auth.user = this._username
  //     configTransport.auth.type = this._mailType
  //     configTransport.auth.clientId = this._OAuthClientID
  //     configTransport.auth.clientSecret = this._OAuthClientSecret
  //     configTransport.auth.refreshToken = this._OAuthRefreshToken
  //     configTransport.auth.accessToken = accessToken()
  //   } else if (this._driver === 'smtp' && this._isMailgunAPI) {
  //     // SMTP with Mailgun API
  //     configTransport.auth.api_key = this._mailApiKey
  //     configTransport.auth.domain = this._mailDomain
  //   } else if (this._driver === 'relay') {
  //     configTransport.host = this._host
  //     configTransport.port = this._port
  //     configTransport.secure = this._secure || false

  //     configTransport.auth.user = this._username || undefined
  //     configTransport.auth.pass = this._password || undefined

  //     configTransport.tls.rejectUnauthorized = false
  //     configTransport.tls.ciphers = this._mailRelayChiper || 'SSLv3'
  //   } else {
  //     // SMTP Default
  //     configTransport.host = this._host
  //     configTransport.port = this._port
  //     configTransport.auth.user = this._username
  //     configTransport.auth.pass = this._password
  //   }

  //   return configTransport
  // }

  /**
   * Set Mail Options
   * @param params
   * @returns
   */
  private _setMailOptions(params: SendMailOptions): nodemailer.SendMailOptions {
    const { dest, subject, text } = params

    const result = {
      from: this._config.from,
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
  private _client(): nodemailer.Transporter<SMTPTransport.SentMessageInfo> {
    // Nodemailer Transport
    const transporter = nodemailer.createTransport(
      this._transport,
      this._defaults
    )

    return transporter
  }

  /**
   * Initialize Mail Service
   */
  public initialize(): void {
    // Nodemailer Transport
    const transporter = this._client()

    transporter.verify(function (err: Error | null, success: boolean) {
      if (err) {
        const message = `${errMsgType} - ${err.message ?? err}`
        logger.error(message)

        throw new Error(err.message)
      } else {
        const message = `${msgType} - mail service is ready to take our messages`
        logger.info(message, { success })
      }
    })
  }

  /**
   * Send Mail Config Transporter
   * @param params
   */
  private _sendMail(params: SendMailOptions): void {
    const { dest, subject, text } = params

    // client
    const transporter = this._client()

    // mail options
    const mailOptions = this._setMailOptions({ dest, subject, text })

    // transporter send mail
    transporter.sendMail(
      mailOptions,
      (err: Error | null, info: SMTPTransport.SentMessageInfo) => {
        if (err) {
          const errMessage = `something went wrong!, ${err.message ?? err}`

          const message = `${errMsgType} - ${errMessage}`
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
