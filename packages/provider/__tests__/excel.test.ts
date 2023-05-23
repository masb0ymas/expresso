import { writeFileStream } from 'expresso-core'
import fs from 'fs'
import { Excel } from '../src'

const excel = new Excel()

describe('excel provider', () => {
  test('should sheet to json', () => {
    const filePath = `${process.cwd()}/public/output/dummyExcel.xlsx`

    const result = excel.sheetToJson(filePath)
    console.log(result)

    expect(result).not.toBe(null)
  })

  test('should convert excel to json', () => {
    const filePath = `${process.cwd()}/public/output/dummyExcel.xlsx`

    const result = excel.convertToJson(filePath)
    console.log(result)

    expect(result).not.toBe(null)
  })

  test('should convert json to excel', async () => {
    const headers = [
      { header: 'No', key: 'no', width: 5 },
      { header: 'name', key: 'name', width: 20 },
    ]

    const anyData = [
      {
        id: 1,
        name: 'any name 1',
      },
      {
        id: 2,
        name: 'any name 2',
      },
    ]

    const outputPath = `${process.cwd()}/public/output/outputExcel.xlsx`
    const streamExcel: Buffer = await excel.generate(headers, anyData)

    await writeFileStream(outputPath, streamExcel)
    const exists = fs.existsSync(outputPath)

    expect(exists).toBe(true)
  })
})
