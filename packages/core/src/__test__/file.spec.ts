import * as fs from 'fs'
import * as path from 'path'
import {
  createDirNotExist,
  deleteFile,
  readHTMLFile,
  writeFileStream,
} from '..'

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

  test('should write file stream', async () => {
    const outputPath = path.resolve(`${process.cwd()}/public/output`)
    const anyContent = 'Any Content For Testing'

    createDirNotExist(outputPath)
    await writeFileStream(`${outputPath}/test.txt`, Buffer.from(anyContent))

    // Result Value from Write file
    const content = await readHTMLFile(`${outputPath}/test.txt`)
    expect(content).toMatch(/Content/)
  })

  test('should delete file', () => {
    const outputPath = path.resolve(`${process.cwd()}/public/output/test.txt`)

    deleteFile(outputPath)
    const exists = fs.existsSync(outputPath)

    expect(exists).toBe(false)
  })
})
