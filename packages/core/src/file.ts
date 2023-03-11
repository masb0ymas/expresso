import fs from 'fs'
import * as fsAsync from 'fs/promises'
import path from 'path'
import { printLog } from './formatter'

/**
 * Create Dir Not Exist
 * @param _path
 */
export function createDirNotExist(_path: string): void {
  if (!fs.existsSync(path.resolve(_path))) {
    fs.mkdirSync(_path, { recursive: true })

    const logMessage = printLog('FileSystem :', `create directory ${_path}`)
    console.log(logMessage)
  }
}

/**
 * Read HTML File
 * @param _path
 * @returns
 */
export async function readHTMLFile(
  _path: fs.PathLike | fs.promises.FileHandle
): Promise<string> {
  try {
    const result = await fsAsync.readFile(_path, { encoding: 'utf-8' })
    return result
  } catch (err) {
    throw new Error('invalid html path')
  }
}

/**
 *
 * @param _path
 * @param streamFile
 */
export async function writeFileStream(
  _path: string,
  streamFile: Buffer
): Promise<void> {
  try {
    await fsAsync.writeFile(_path, streamFile)

    const msgType = `File : ${_path}`
    const message = 'generate file successfully'
    const logMessage = printLog(msgType, message)

    console.log(logMessage)
  } catch (err) {
    const msgType = `File : ${_path}`
    const logMessage = printLog(msgType, String(err), { label: 'error' })

    console.log(logMessage)
    throw new Error('failed to generate write file stream')
  }
}

/**
 * Delete File
 * @param _path
 */
export function deleteFile(_path: string): void {
  const filePath = path.resolve(_path)

  const msgType = `File : ${filePath}`

  if (_path && fs.existsSync(filePath)) {
    const message = 'has been deleted'
    const logMessage = printLog(msgType, message)

    console.log(logMessage)

    fs.unlinkSync(path.resolve(filePath))
  } else {
    const message = 'not exist'
    const logMessage = printLog(msgType, message, { label: 'error' })

    console.log(logMessage)
  }
}
