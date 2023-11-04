export type MailDriver = 'smtp' | 'gmail' | 'relay'

export type MailAuth = 'OAuth2'

export interface MailProvider {
  driver: MailDriver
  username?: string
  password?: string
  from?: string
  host?: string
  port?: number
  secure?: boolean
  appName: string
}

export interface MailOptions {
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
