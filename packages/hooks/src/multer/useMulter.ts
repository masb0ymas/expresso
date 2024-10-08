import { green } from 'colorette'
import { type Request } from 'express'
import { logger } from 'expresso-core'
import multer from 'multer'
import slugify from 'slugify'
import { defaultAllowedExt } from './allowedExtension'
import { Mimetype } from './allowedMimetype'
import { MulterConfig } from './types'

const mimetype = new Mimetype()

const defaultFieldSize = 10 * 1024 * 1024 // 10mb
const defaultFileSize = 1 * 1024 * 1024 // 1mb
const defaultDestination = `${process.cwd()}/public/uploads/`

const msgType = `${green('multer')}`

/**
 * useMulter
 * @param values
 * @returns
 */
export function useMulter(values: MulterConfig): multer.Multer {
  const destination = values.dest ?? defaultDestination
  const allowedMimetype = values.allowedMimetype ?? mimetype.default
  const allowedExt = values.allowedExt ?? defaultAllowedExt

  const storage = multer.diskStorage({
    destination,
    filename: (_req: Request, file: Express.Multer.File, cb) => {
      const slugFilename = slugify(file.originalname, {
        replacement: '_',
        lower: true,
      })
      cb(null, `${Date.now()}-${slugFilename}`)
    },
  })

  return multer({
    storage,
    fileFilter: (_req, file, cb) => {
      const newMimetype = file.mimetype.toLowerCase()

      if (!allowedMimetype.includes(newMimetype)) {
        const extensions = allowedExt.join(', ')
        const errMessage = `Only ${extensions} extensions are allowed. Please check your file type.`
        logger.error(`${msgType} - ${errMessage}`)
        cb(new Error(errMessage))
        return
      }

      cb(null, true)
    },
    limits: values.limit ?? {
      fieldSize: defaultFieldSize,
      fileSize: defaultFileSize,
    },
  })
}
