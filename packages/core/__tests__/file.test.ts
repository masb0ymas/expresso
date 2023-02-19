import fs from 'fs'
import path from 'path'
import { createDirNotExist } from '../src'

describe('core file test', () => {
  beforeEach(() => {
    const dir = `${process.cwd()}/public/temp`
    const exists = fs.existsSync(dir)

    if (exists) {
      fs.rmSync(path.resolve(dir), { recursive: true })
    }
  })

  test('should create dir not exist', () => {
    const dir = `${process.cwd()}/public/temp`

    createDirNotExist(dir)
    const exists = fs.existsSync(dir)

    expect(exists).toBe(true)
  })
})
