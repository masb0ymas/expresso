import fs from 'fs'
import * as fsAsync from 'fs/promises'
import path from 'path'

/**
 * Create Dir Not Exist
 * @param _path
 */
export function createDirNotExist(_path: string): void {
  if (!fs.existsSync(path.resolve(_path))) {
    fs.mkdirSync(_path, { recursive: true })
    console.log(`create directory ${_path}`)
  }
}

/**
 * Read HTML File
 * @param _path
 * @returns
 */
export async function readHTMLFile(_path: string): Promise<string> {
  try {
    const result = await fsAsync.readFile(_path, { encoding: 'utf-8' })
    return result
  } catch (err) {
    throw new Error('invalid html path')
  }
}
