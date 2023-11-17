import 'dotenv/config'
import { readHTMLFile } from 'expresso-core'
import Handlebars from 'handlebars'
import path from 'path'
import { SMTP } from '../src'

describe('mail testing', () => {
  const registerHtmlPath = path.resolve(
    `${__dirname}/../../../assets/templates/register.html`
  )

  const from = `expresso <halo@expresso.com>`

  const mailService = new SMTP(
    { from },
    {
      service: 'smtp',
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: String(process.env.MAIL_USERNAME),
        pass: String(process.env.MAIL_PASSWORD),
      },
    }
  )

  test('should initial mail service', () => {
    expect(() => {
      mailService.initialize()
    }).not.toBe(null)
  })

  test('should send mail', async () => {
    const anyMailReceiver = String(process.env.MAIL_TO)
    const anySubject = 'Testing App'

    mailService.initialize()

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
