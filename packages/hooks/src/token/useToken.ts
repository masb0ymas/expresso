import { green } from 'colorette'
import { type Request } from 'express'
import { ms } from 'expresso-core'
import { FastifyRequest } from 'fastify'
import jwt, {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from 'jsonwebtoken'
import _ from 'lodash'
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
  public static extract(req: Request | FastifyRequest): string | null {
    const authQuery = _.get(req, 'query.token', undefined)
    const authCookie = _.get(req, 'cookies.token', undefined)
    const authHeader = _.get(req, 'headers.authorization', undefined)

    // extract from query
    if (authQuery) {
      const message = `${msgType} - ${'extract auth from query'}`
      logger.info(message)

      return String(authQuery)
    }

    // extract from cookie
    if (authCookie) {
      const message = `${msgType} - ${'extract auth from cookie'}`
      logger.info(message)

      return String(authCookie)
    }

    // extract from header authorization
    if (authHeader) {
      const splitAuthorize = authHeader.split(' ')
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
      if (err instanceof TokenExpiredError) {
        const errType = 'jwt expired error'

        const message = `${msgType} - ${errType}, ${err.message ?? err}`
        logger.error(message)

        return { data: null, message: `${errType} : ${err.message}` }
      }

      // Error JWT Web Token
      if (err instanceof JsonWebTokenError) {
        const errType = 'jwt token error'

        const message = `${msgType} - ${errType}, ${err.message ?? err}`
        logger.error(message)

        return { data: null, message: `${errType} : ${err.message}` }
      }

      // Error Not Before
      if (err instanceof NotBeforeError) {
        const errType = 'jwt not before error'

        const message = `${msgType} - ${errType}, ${err.message ?? err}`
        logger.error(message)

        return { data: null, message: `${errType} : ${err.message}` }
      }
    }
  }
}
