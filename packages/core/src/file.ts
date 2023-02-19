import fs from 'fs'
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
