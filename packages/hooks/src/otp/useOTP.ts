import crypto from 'crypto'
import { ms } from 'expresso-core'
import { HashEntity, HashOTPEntity } from './types'

export class useOTP {
  /**
   *
   * @param payload
   * @param options
   * @returns
   */
  public hash(payload: string, options: HashEntity): string {
    const hash = crypto
      .createHmac('sha256', options.secretKey)
      .update(payload)
      .digest('hex')

    return hash
  }

  /**
   *
   * @param payload
   * @param options
   * @returns
   */
  public hashOTP(payload: string, options: HashOTPEntity): string {
    const ttl = ms(options.expires) // 5 Minutes in miliseconds
    const expiresIn = Date.now() + Number(ttl) // timestamp to 5 minutes in the future
    const newPayload = `${payload}.${expiresIn}` // phone.otp.expiry_timestamp

    const hash = this.hash(newPayload, { secretKey: options.secretKey }) // creating SHA256 hash of the data
    const result = `${hash}.${expiresIn}` // Hash.expires, format to send to the user

    return result
  }

  /**
   *
   * @param payload
   * @param hash
   * @param options
   * @returns
   */
  public compare(payload: string, hash: string, options: HashEntity): boolean {
    const compareHash = this.hash(payload, { secretKey: options.secretKey })

    if (hash === compareHash) {
      return true
    }

    return false
  }

  /**
   *
   * @param payload
   * @param hash
   * @param options
   * @returns
   */
  public verifyHash(
    payload: string,
    hash: string,
    options: HashEntity
  ): boolean {
    const [hashValue, expires] = hash.split('.')

    // Check if expiry time has passed
    const now = Date.now()
    if (now > parseInt(expires)) return false

    // Calculate new hash with the same key and the same algorithm
    const newPayload = `${payload}.${expires}`
    const compare = this.compare(newPayload, hashValue, {
      secretKey: options.secretKey,
    })

    return compare
  }
}
