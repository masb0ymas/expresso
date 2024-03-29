import { useToken } from '../src'

describe('helpers token test', () => {
  test('should generate token', () => {
    const anyValue = { uid: '3859acb9-c7b7-4273-b239-02dcf1e1fcb5' }
    const anySecretKey = 'anyTestKey'

    const data = useToken.generate({
      value: anyValue,
      secretKey: anySecretKey,
      expires: '1d',
    })

    console.log(data)

    expect(data.token).not.toBeNull()
  })

  test('should verify token', () => {
    const anyValue = { uid: '3859acb9-c7b7-4273-b239-02dcf1e1fcb5' }
    const anySecretKey = 'anyTestKey'

    const data = useToken.generate({
      value: anyValue,
      secretKey: anySecretKey,
      expires: '1d',
    })

    const result = useToken.verify({
      token: data.token,
      secretKey: anySecretKey,
    })

    console.log(data, result)

    expect(result?.data).not.toBeNull()
  })
})
