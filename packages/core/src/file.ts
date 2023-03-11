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
