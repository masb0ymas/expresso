import { green } from 'colorette'
import { type Request } from 'express'
import { ms } from 'expresso-core'
import { type IncomingHttpHeaders } from 'http'
import * as jwt from 'jsonwebtoken'
import pino from 'pino'
import {
  type DtoGenerateToken,
  type DtoVerifyToken,
  type GenerateTokenEntity,
  type VerifyTokenEntity,
} from './interface'

const logger = pino({
  transport: { target: 'pino-pretty', options: { colorize: true } },
})

const msgType = `${green('token')}`

export class useToken {
  /**
   * Generate Token
   * @param params
   * @returns
   */
  public static generate(params: GenerateTokenEntity): DtoGenerateToken {
    const { value, secretKey, expires } = params

    const tokenExpires = ms(expires)
    const expiresIn = Number(tokenExpires) / 1000

    const payload = JSON.parse(JSON.stringify(value))
    const token = jwt.sign(payload, secretKey, { expiresIn })

    return { token, expiresIn }
  }

  /**
   * Extract Token
   * @param req
   * @returns
   */
  public static extract(req: Request): string | null {
    const query = req.query
    const cookie = req.cookies
    const header: IncomingHttpHeaders = req.headers

    // extract from query
    if (query?.token) {
      const message = `${msgType} - ${'extract auth from query'}`
      logger.info(message)

      return String(query?.token)
    }

    // extract from cookie
    if (cookie?.token) {
      const message = `${msgType} - ${'extract auth from cookie'}`
      logger.info(message)

      return String(cookie?.token)
    }

    // extract from header authorization
    if (header.authorization) {
      const splitAuthorize = header.authorization.split(' ')
      const allowedAuthorize = ['Bearer', 'JWT', 'Token']

      if (splitAuthorize.length === 2) {
        if (allowedAuthorize.includes(splitAuthorize[0])) {
          const message = `${msgType} - ${'extract auth from header auth'}`
          logger.info(message)

          return splitAuthorize[1]
        }
      }
    }

    return null
  }

  /**
   * Verify Token
   * @param params
   * @returns
   */
  public static verify(params: VerifyTokenEntity): DtoVerifyToken {
    const { token, secretKey } = params

    try {
      if (!token) {
        return { data: null, message: 'unauthorized' }
      }

      const result = jwt.verify(token, secretKey)
      return { data: result, message: 'token is verify' }
    } catch (err) {
      // Error Token Expired
      if (err instanceof jwt.TokenExpiredError) {
        const errType = 'jwt expired error'

        const message = `${msgType} - ${errType}, ${err.message ?? err}`
        logger.error(message)

        return { data: null, message: `${errType} : ${err.message}` }
      }

      // Error JWT Web Token
      if (err instanceof jwt.JsonWebTokenError) {
        const errType = 'jwt token error'

        const message = `${msgType} - ${errType}, ${err.message ?? err}`
        logger.error(message)

        return { data: null, message: `${errType} : ${err.message}` }
      }

      // Error Not Before
      if (err instanceof jwt.NotBeforeError) {
        const errType = 'jwt not before error'

        const message = `${msgType} - ${errType}, ${err.message ?? err}`
        logger.error(message)

        return { data: null, message: `${errType} : ${err.message}` }
      }
    }
  }
}
