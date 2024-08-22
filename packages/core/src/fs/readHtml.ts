import { green } from 'colorette'
import fs from 'fs'
import * as fsAsync from 'fs/promises'
import { logger } from '../logger'

const msgType = `${green('filesystem')}`

/**
 * Read HTML File
 * @param filePath
 * @returns
 */
export async function readHTMLFile(
  filePath: fs.PathLike | fs.promises.FileHandle
): Promise<string> {
  try {
    return await fsAsync.readFile(filePath, 'utf-8')
  } catch (err) {
    logger.error(`${msgType} - Invalid HTML file path: ${filePath}`)
    throw new Error(`Invalid HTML file path: ${filePath}`)
  }
}
