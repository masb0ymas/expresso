import { green } from 'colorette'
import fs from 'fs'
import path from 'path'
import pino from 'pino'

const logger = pino({
  transport: { target: 'pino-pretty', options: { colorize: true } },
})

const msgType = `${green('filesystem')}`

/**
 * Create Dir Not Exist
 * @param filePath
 */
export function createDirNotExist(filePath: string): void {
  if (!fs.existsSync(path.resolve(filePath))) {
    fs.mkdirSync(filePath, { recursive: true })

    const message = `${msgType} - create directory ${filePath}`
    logger.info(message)
  }
}
