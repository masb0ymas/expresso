import { writeFileStream } from 'expresso-core'
import fs from 'fs'
import { Excel } from '../src'

const excel = new Excel()

describe('excel provider', () => {
  const dummyExcelPath = `${__dirname}/../../../assets/output/dummyExcel.xlsx`
  const outputExcel = `${__dirname}/../../../assets/output/outputExcel.xlsx`

  test('should sheet to json', () => {
    const result = excel.sheetToJson(dummyExcelPath)
    console.log(result)

    expect(result).not.toBe(null)
  })

  test('should convert excel to json', () => {
    const result = excel.convertToJson(dummyExcelPath)
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

    const streamExcel: Buffer = await excel.generate(headers, anyData)

    await writeFileStream(outputExcel, streamExcel)
    const exists = fs.existsSync(outputExcel)

    expect(exists).toBe(true)
  })
})
