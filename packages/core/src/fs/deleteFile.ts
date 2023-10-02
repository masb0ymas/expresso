import { green } from 'colorette'
import fs from 'fs'
import path from 'path'
import pino from 'pino'

const logger = pino()
const msgType = `${green('filesystem')}`

/**
 * Delete File
 * @param filePath
 */
export function deleteFile(filePath: string): void {
  const _path = path.resolve(filePath)

  if (_path && fs.existsSync(_path)) {
    const message = `${msgType} - ${filePath} has been deleted`
    logger.info(message)

    fs.unlinkSync(_path)
  } else {
    const message = `${msgType} - ${filePath} does not exists`
    logger.error(message)
  }
}
