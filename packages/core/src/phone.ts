import {
  parsePhoneNumberFromString,
  type CountryCode,
  type E164Number,
} from 'libphonenumber-js'

interface IPhone {
  country?: CountryCode
}

export class Phone {
  private readonly _country?: CountryCode

  constructor(options: IPhone) {
    this._country = options?.country ?? 'ID'
  }

  /**
   *
   * @param payload
   * @returns
   */
  public format(value: string): E164Number | undefined {
    const phone = parsePhoneNumberFromString(value, this._country)
    const result = phone?.number

    return result
  }

  /**
   *
   * @param value
   * @returns
   */
  public formatWhatsapp(value: string): string {
    const phone = this.format(value)

    let formatted = ''

    if (!phone?.endsWith('@c.us')) {
      formatted = `${phone}@c.us`
    }

    const result = formatted.replace('+', '')

    return result
  }

  /**
   *
   * @param value
   * @returns
   */
  public hidePhone(value: string): string {
    const phone = parsePhoneNumberFromString(value, this._country)

    const phoneNumber = phone?.nationalNumber // '81234567890'
    const countryCode = phone?.countryCallingCode // 62

    const lengthPhone = phoneNumber?.length
    const hideLength = Number(lengthPhone) - 6

    const startPhone = phoneNumber?.slice(0, hideLength) // '81234'
    const endPhone = phoneNumber?.slice(hideLength + 3) // '890'

    const result = `+${countryCode}${startPhone}***${endPhone}` // '+6281234***890'

    return result
  }
}
