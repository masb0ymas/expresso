import { green } from 'colorette'
import * as fsAsync from 'fs/promises'
import pino from 'pino'

const logger = pino()
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

    const message = `${msgType} - generate file successfully ${filePath}`
    logger.info(message)
  } catch (err) {
    const message = `${msgType} - error generate file${err}`
    logger.error(message)

    throw new Error('failed to generate write file stream')
  }
}
