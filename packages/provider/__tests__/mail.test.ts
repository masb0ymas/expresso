import 'dotenv/config'
import { readHTMLFile } from 'expresso-core'
import Handlebars from 'handlebars'
import path from 'path'
import { Mail } from '../src'

describe('mail testing', () => {
  const registerHtmlPath = path.resolve(
    `${__dirname}/../../../assets/templates/register.html`
  )

  test('should initial mail service', () => {
    const mailService = new Mail({
      driver: 'smtp',
      host: 'smtp.mailtrap.io',
      port: 2525,
      username: String(process.env.MAIL_USERNAME),
      password: String(process.env.MAIL_PASSWORD),
      appName: 'expresso Monorepo',
    })

    expect(() => {
      mailService.initialize()
    }).not.toBe(null)
  })

  test('should send mail', async () => {
    const mailService = new Mail({
      driver: 'smtp',
      host: 'smtp.mailtrap.io',
      port: 2525,
      username: String(process.env.MAIL_USERNAME),
      password: String(process.env.MAIL_PASSWORD),
      appName: 'expresso Monorepo',
    })

    const anyMailReceiver = String(process.env.MAIL_TO)
    const anySubject = 'Testing App'

    const html = await readHTMLFile(registerHtmlPath)

    const template = Handlebars.compile(html)
    const htmlToSend = template({
      email: anyMailReceiver,
      fullname: 'test content email',
    })

    const expectFn = jest.fn(() => {
      mailService.send(anyMailReceiver, anySubject, htmlToSend)
    })

    expect(expectFn).not.toBeNull()
  })
})
