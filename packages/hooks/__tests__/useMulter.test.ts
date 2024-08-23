import multer from 'multer'
import slugify from 'slugify'
import { useMulter } from '../src'

// Mock dependencies
jest.mock('multer')
jest.mock('slugify')

describe('useMulter function', () => {
  const mockMulter = multer as jest.MockedFunction<typeof multer>
  const mockSlugify = slugify as jest.MockedFunction<typeof slugify>

  beforeEach(() => {
    jest.clearAllMocks()
    mockMulter.diskStorage = jest.fn().mockReturnValue({} as any)
    mockMulter.mockReturnValue({} as any)
  })

  test('uses default values when not provided', () => {
    useMulter({})

    expect(mockMulter.diskStorage).toHaveBeenCalledWith(
      expect.objectContaining({
        destination: expect.any(String),
      })
    )

    expect(mockMulter).toHaveBeenCalledWith(
      expect.objectContaining({
        limits: expect.objectContaining({
          fieldSize: expect.any(Number),
          fileSize: expect.any(Number),
        }),
      })
    )
  })

  test('uses provided values when given', () => {
    const config = {
      dest: '/custom/path',
      allowedMimetype: ['image/png'],
      allowedExt: ['.png'],
      limit: { fieldSize: 1000, fileSize: 1000000 },
    }

    useMulter(config)

    expect(mockMulter.diskStorage).toHaveBeenCalledWith(
      expect.objectContaining({
        destination: '/custom/path',
      })
    )

    expect(mockMulter).toHaveBeenCalledWith(
      expect.objectContaining({
        limits: config.limit,
      })
    )
  })

  test('filename callback generates correct filename', () => {
    useMulter({})

    const diskStorageOptions = (mockMulter.diskStorage as jest.Mock).mock
      .calls[0][0]
    const filenameCb = diskStorageOptions.filename

    const mockFile = { originalname: 'test file.jpg' } as Express.Multer.File
    const mockCallback = jest.fn()

    mockSlugify.mockReturnValue('test_file_jpg')

    filenameCb({} as Request, mockFile, mockCallback)

    expect(mockSlugify).toHaveBeenCalledWith('test file.jpg', {
      replacement: '_',
      lower: true,
    })
    expect(mockCallback).toHaveBeenCalledWith(
      null,
      expect.stringMatching(/^\d+-test_file_jpg$/)
    )
  })

  test('fileFilter allows valid mimetype', () => {
    const config = {
      allowedMimetype: ['image/jpeg'],
      allowedExt: ['.jpg', '.jpeg'],
    }

    useMulter(config)

    const multerOptions = mockMulter.mock.calls[0][0]
    const fileFilter = multerOptions?.fileFilter

    const mockFile = { mimetype: 'image/jpeg' } as Express.Multer.File
    const mockCallback = jest.fn()

    // @ts-expect-error
    fileFilter({} as Request, mockFile, mockCallback)

    expect(mockCallback).toHaveBeenCalledWith(null, true)
  })

  test('fileFilter rejects invalid mimetype', () => {
    const config = {
      allowedMimetype: ['image/jpeg'],
      allowedExt: ['.jpg', '.jpeg'],
    }

    useMulter(config)

    const multerOptions = mockMulter.mock.calls[0][0]
    const fileFilter = multerOptions?.fileFilter

    const mockFile = { mimetype: 'image/png' } as Express.Multer.File
    const mockCallback = jest.fn()

    // @ts-expect-error
    fileFilter({} as Request, mockFile, mockCallback)

    expect(mockCallback).toHaveBeenCalledWith(expect.any(Error))
  })
})
