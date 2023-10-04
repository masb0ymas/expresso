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
    const result = await fsAsync.readFile(filePath, { encoding: 'utf-8' })
    return result
  } catch (err) {
    const message = `${msgType} - invalid html file path`
    logger.error(message)

    throw new Error('invalid html path')
  }
}
