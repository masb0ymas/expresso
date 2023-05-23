import fs from 'fs'
import * as fsAsync from 'fs/promises'
import path from 'path'
import { printLog } from './formatter'

/**
 * Create Dir Not Exist
 * @param filePath
 */
export function createDirNotExist(filePath: string): void {
  if (!fs.existsSync(path.resolve(filePath))) {
    fs.mkdirSync(filePath, { recursive: true })

    const logMessage = printLog('FileSystem :', `create directory ${filePath}`)
    console.log(logMessage)
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

    const msgType = `File : ${filePath}`
    const message = 'generate file successfully'
    const logMessage = printLog(msgType, message)

    console.log(logMessage)
  } catch (err) {
    const msgType = `File : ${filePath}`
    const logMessage = printLog(msgType, String(err), { label: 'error' })

    console.log(logMessage)
    throw new Error('failed to generate write file stream')
  }
}

/**
 * Delete File
 * @param filePath
 */
export function deleteFile(filePath: string): void {
  const _path = path.resolve(filePath)

  const msgType = `File : ${filePath}`

  if (_path && fs.existsSync(_path)) {
    const message = 'has been deleted'
    const logMessage = printLog(msgType, message)

    console.log(logMessage)

    fs.unlinkSync(_path)
  } else {
    const message = 'not exist'
    const logMessage = printLog(msgType, message, { label: 'error' })

    console.log(logMessage)
  }
}
