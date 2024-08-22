import { green } from 'colorette'
import * as fsAsync from 'fs/promises'
import { logger } from '../logger'

const msgType = `${green('filesystem')}`

/**
 *
 * @param filePath
 * @param streamFile
 */
export async function writeFileStream(
  filePath: string,
  streamFile: Buffer
): Promise<void> {
  try {
    await fsAsync.writeFile(filePath, streamFile)
    logger.info(`${msgType} - File generated successfully: ${filePath}`)
  } catch (err: any) {
    logger.error(`${msgType} - Error generating file: ${err}`)
    throw new Error(`Failed to write file stream: ${err.message}`)
  }
}
