import { green } from 'colorette'
import fs from 'fs'
import path from 'path'
import { logger } from '../logger'

const msgType = `${green('filesystem')}`

/**
 * Create Dir Not Exist
 * @param filePath
 */
export function createDirNotExist(filePath: string): void {
  const resolvedPath = path.resolve(filePath)

  if (!fs.existsSync(resolvedPath)) {
    fs.mkdirSync(resolvedPath, { recursive: true })
    logger.info(`${msgType} - created directory: ${resolvedPath}`)
  }
}
