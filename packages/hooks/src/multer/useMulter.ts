import { cyan } from 'colorette'
import { type Request } from 'express'
import multer from 'multer'
import pino from 'pino'
import slugify from 'slugify'
import { defaultAllowedExt } from './allowedExtension'
import { Mimetype } from './allowedMimetype'
import { type MulterConfigEntity } from './interface'

const logger = pino({
  transport: { target: 'pino-pretty', options: { colorize: true } },
})

const mimetype = new Mimetype()

const defaultFieldSize = 10 * 1024 * 1024 // 10mb
const defaultFileSize = 1 * 1024 * 1024 // 1mb
const defaultDestination = `${process.cwd()}/public/uploads/`

const msgType = `${cyan('multer')}`

/**
 * useMulter
 * @param values
 * @returns
 */
export function useMulter(values: MulterConfigEntity): multer.Multer {
  // always check destination
  const destination = values.dest ?? defaultDestination

  // config storage
  const storage = multer.diskStorage({
    destination,
    filename(_req: Request, file: Express.Multer.File, cb): void {
      const slugFilename = slugify(file.originalname, {
        replacement: '_',
        lower: true,
      })
      cb(null, [Date.now(), slugFilename].join('-'))
    },
  })

  // config multer upload
  const configMulter = multer({
    storage,
    fileFilter(_req, file, cb) {
      const allowedMimetype = values.allowedMimetype ?? mimetype.default
      const allowedExt = values.allowedExt ?? defaultAllowedExt
      const newMimetype = file.mimetype.toLowerCase()

      if (!allowedMimetype.includes(newMimetype)) {
        const getExtension = allowedExt.join(', ') // .png, .jpg, .pdf
        const errMessage = `Only ${getExtension} ext are allowed, please check your mimetype file`

        const message = `${msgType} - ${errMessage}`
        logger.error(message)

        cb(new Error(message))
        return
      }

      cb(null, true)
    },
    limits: values.limit ?? {
      fieldSize: defaultFieldSize,
      fileSize: defaultFileSize,
    },
  })

  return configMulter
}
