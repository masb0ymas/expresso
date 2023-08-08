import { useOTP } from '../src'

const otp = new useOTP()

describe('helpers OTP Test', () => {
  test('should create hash otp', () => {
    const anyPhone = '081234567890'
    const anyOTP = '123456'
    const anySecretKey = '1234567890abcdef'

    const payload = JSON.stringify({ phone: anyPhone, otp: anyOTP })

    const data = otp.hashOTP(payload, {
      expires: '1d',
      secretKey: anySecretKey,
    })

    console.log(data)

    expect(data).not.toBeNull()
  })

  test('should create hash otp with length value', () => {
    const anyPhone = '081234567890'
    const anyOTP = '123456'
    const anySecretKey = '1234567890abcdef'

    const payload = JSON.stringify({ phone: anyPhone, otp: anyOTP })

    const data = otp.hashOTP(payload, {
      expires: '1d',
      secretKey: anySecretKey,
    })

    const splitData = data.split('.')

    console.log(splitData)

    expect(splitData).toHaveLength(2)
  })

  test('should verify hash otp', () => {
    const anyPhone = '081234567890'
    const anyOTP = '123456'
    const anySecretKey = '1234567890abcdef'

    const payload = JSON.stringify({ phone: anyPhone, otp: anyOTP })

    const hashOTP = otp.hashOTP(payload, {
      expires: '1d',
      secretKey: anySecretKey,
    })

    const verifyHash = otp.verifyHash(payload, hashOTP, {
      secretKey: anySecretKey,
    })

    console.log(hashOTP, verifyHash)

    expect(verifyHash).toBe(true)
  })
})
