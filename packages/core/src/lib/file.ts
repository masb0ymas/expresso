import { green } from 'colorette'
import * as fs from 'fs'
import * as fsAsync from 'fs/promises'
import * as path from 'path'
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
