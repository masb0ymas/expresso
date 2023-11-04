import * as argon2 from 'argon2'
import * as bcrypt from 'bcrypt'
import { HashType } from './types'

export class Hash {
  private readonly _type: string

  constructor(type?: HashType) {
    this._type = type || 'argon2'
  }

  /**
   *
   * @param value
   * @returns
   */
  public async hash(value: string): Promise<string> {
    let hash = ''

    if (this._type === 'argon2') {
      hash = await this._hashArgon2(value)
    }

    if (this._type === 'bcrypt') {
      hash = await this._hashBcrypt(value)
    }

    return hash
  }

  /**
   *
   * @param value
   * @param options
   * @returns
   */
  private async _hashArgon2(
    value: string | Buffer,
    options?:
      | (argon2.Options & {
          raw?: false | undefined
        })
      | undefined
  ): Promise<string> {
    const hash = await argon2.hash(value, options)
    return hash
  }

  /**
   *
   * @param value
   * @param options
   * @returns
   */
  private async _hashBcrypt(
    value: string | Buffer,
    options?: { salt?: number }
  ): Promise<string> {
    const salt = options?.salt ?? 10

    const hash = await bcrypt.hash(value, salt)
    return hash
  }

  /**
   *
   * @param hashValue
   * @param value
   * @returns
   */
  public async verify(
    hashValue: string,
    value: string | Buffer
  ): Promise<boolean> {
    let compare = false

    if (this._type === 'argon2') {
      compare = await this._verifyHashArgon2(hashValue, value)
    }

    if (this._type === 'bcrypt') {
      compare = await this._verifyHashBcrypt(hashValue, value)
    }

    return compare
  }

  /**
   *
   * @param hashValue
   * @param value
   * @returns
   */
  private async _verifyHashArgon2(
    hashValue: string,
    value: string | Buffer
  ): Promise<boolean> {
    const compare = await argon2.verify(hashValue, value)
    return compare
  }

  /**
   *
   * @param hashValue
   * @param value
   * @returns
   */
  private async _verifyHashBcrypt(
    hashValue: string,
    value: string | Buffer
  ): Promise<boolean> {
    const compare = await bcrypt.compare(value, hashValue)
    return compare
  }
}
