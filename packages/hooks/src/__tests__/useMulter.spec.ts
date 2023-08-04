import { useMulter } from '..'

describe('hooks useMulter test', () => {
  test('should upload file with multer', () => {
    const dest = `${process.cwd()}/public/uploads`

    const anyUpload = useMulter({ dest }).fields([
      { name: 'fileUpload', maxCount: 1 },
    ])

    expect(() => anyUpload).not.toBeUndefined()
  })
})
