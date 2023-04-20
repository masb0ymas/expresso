import { type Request } from 'express'
import { ms, printLog } from 'expresso-core'
import { type IncomingHttpHeaders } from 'http'
import jwt, {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from 'jsonwebtoken'
import {
  type DtoVerifyToken,
  type DtoGenerateToken,
  type GenerateTokenEntity,
  type VerifyTokenEntity,
} from './interface'

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
      const logMessage = printLog('Auth', 'Extract from Query')
      console.log(logMessage)

      return String(query?.token)
    }

    // extract from cookie
    if (cookie?.token) {
      const logMessage = printLog('Auth', 'Extract from Cookie')
      console.log(logMessage)

      return cookie?.token
    }

    // extract from header authorization
    if (header.authorization) {
      const splitAuthorize = header.authorization.split(' ')
      const allowedAuthorize = ['Bearer', 'JWT', 'Token']

      if (splitAuthorize.length === 2) {
        if (allowedAuthorize.includes(splitAuthorize[0])) {
          const logMessage = printLog(
            'Auth',
            'Extract from Header Authorization'
          )
          console.log(logMessage)

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
        const message = err.message ?? err

        const logMessage = printLog(errType, message, { label: 'error' })
        console.log(logMessage)

        return { data: null, message: `${errType} : ${err.message}` }
      }

      // Error JWT Web Token
      if (err instanceof JsonWebTokenError) {
        const errType = 'jwt token error'
        const message = err.message ?? err

        const logMessage = printLog(errType, message, { label: 'error' })
        console.log(logMessage)

        return { data: null, message: `${errType} : ${err.message}` }
      }

      // Error Not Before
      if (err instanceof NotBeforeError) {
        const errType = 'jwt not before error'
        const message = err.message ?? err

        const logMessage = printLog(errType, message, { label: 'error' })
        console.log(logMessage)

        return { data: null, message: `${errType} : ${err.message}` }
      }
    }
  }
}
