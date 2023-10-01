import { writeFileStream } from 'expresso-core'
import fs from 'fs'
import { Excel } from '../src'

const excel = new Excel()

describe('excel provider', () => {
  const dummyExcelPath = `${__dirname}/../../../assets/uploads/dummyExcel.xlsx`
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

  test('should get cell number', () => {
    const anyValue = 'J'

    const result = excel.getCellNumber(anyValue)

    console.log(result)

    expect(result).toBe(10)
  })

  test('should get cell title', () => {
    const anyValue = 11

    const result = excel.getCellTitle(anyValue)

    console.log(result)

    expect(result).toBe('K')
  })

  test('should mapping cell title', () => {
    const anyValue = 'AD'
    const char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

    const splitChar = char.split('')
    const expectValue = [...splitChar, 'AA', 'AB', 'AC', 'AD']

    const result = excel.mappingCell(anyValue)

    console.log(result, result.toString())

    expect(result.toString()).toEqual(expectValue.toString())
  })

  test('should mapping cell number', () => {
    const anyValue = 29
    const char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

    const splitChar = char.split('')
    const expectValue = [...splitChar, 'AA', 'AB', 'AC']

    const result = excel.mappingCell(anyValue)

    console.log(result, result.toString())

    expect(result.toString()).toEqual(expectValue.toString())
  })
})
