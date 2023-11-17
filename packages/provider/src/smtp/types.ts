import SMTPTransport from 'nodemailer/lib/smtp-transport'

export type MailDriver = 'smtp' | 'gmail' | 'relay'

export type MailAuth = 'OAuth2'

export interface MailConfig {
  from: string
}

export type MailDefaults = SMTPTransport.Options | undefined

export type MailTransporter =
  | string
  | SMTPTransport
  | MailDefaults

interface MailProvider {
  driver: MailDriver
  username?: string
  password?: string
  from?: string
  host?: string
  port?: number
  secure?: boolean
  appName: string
}

interface MailOptions {
  // Mail Config
  mailType?: MailAuth
  mailApiKey?: string
  mailDomain?: string
  mailRelayChiper?: string

  // OAuth Config
  OAuthClientID?: string
  OAuthClientSecret?: string
  OAuthRefreshToken?: string
  OAuthRedirectURL?: string
}

export interface SendMailOptions {
  dest: string
  subject: string
  text: string
}
