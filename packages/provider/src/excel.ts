import * as ExcelJS from 'exceljs'
import { isNumeric, mappingToArray } from 'expresso-core'
import fs from 'fs'
import _ from 'lodash'
import * as XLSX from 'xlsx'

export class ExcelProvider {
  /**
   *
   * @param headers
   * @param data
   * @returns
   */
  public async generate(
    headers: Array<Partial<ExcelJS.Column>>,
    data: any[]
  ): Promise<Buffer> {
    const workBook = new ExcelJS.stream.xlsx.WorkbookWriter({})
    const sheet = workBook.addWorksheet('My Worksheet')

    sheet.columns = headers
    for (let i = 0; i < data.length; i += 1) {
      const tempData = { no: i + 1, ...data[i] }
      sheet.addRow(tempData)
    }
    sheet.getRow(1).font = { bold: true }
    sheet.commit()

    return await new Promise((resolve, reject) => {
      workBook
        .commit()
        .then(() => {
          const { stream } = workBook as any
          const result = stream.read()
          resolve(result)
        })
        .catch((err: any) => {
          reject(err)
        })
    })
  }

  /**
   *
   * @param filePath
   * @returns
   */
  public convertToJson<T>(filePath: string | Buffer): T[] {
    const dummyExcel = fs.readFileSync(filePath)

    const result = new Uint8Array(dummyExcel)
    const XLSXRead = XLSX.read(result, { type: 'array' })
    const XLSXJson: T[] = XLSX.utils.sheet_to_json(XLSXRead.Sheets.Sheet1)

    return XLSXJson
  }

  /**
   *
   * @param payload
   * @param outputPath
   */
  private async _convertToSheet(
    payload: any[],
    outputPath: string
  ): Promise<void> {
    const worksheet: XLSX.WorkSheet = {}
    const newData: any[] = []

    if (_.isEmpty(payload)) {
      throw new Error("payload can't be empty")
    }

    for (let i = 0; i < payload.length; i += 1) {
      const item = payload[i]

      newData.push({ no: i + 1, ...item })
    }

    const dataLength = payload.length
    const limitRange = 100

    const rangeSheet: XLSX.Range = {
      s: {
        c: 0,
        r: 0,
      },
      e: {
        c: limitRange,
        r: limitRange,
      },
    }
    console.log(newData)

    // mapping from array of object to array of array any[][]
    const mapData = mappingToArray(newData)

    console.log(mapData)

    // looping row excel
    for (let Row = 0; Row < dataLength; Row += 1) {
      // looping column excel
      for (let Column = 0; Column < limitRange; Column += 1) {
        const cell: XLSX.CellObject = {
          v: mapData[Row][Column],
          t: 's',
        }

        const cellRef: string = XLSX.utils.encode_cell({
          c: Column,
          r: Row,
        })

        if (Row === 0) {
          cell.v = _.toUpper(mapData[Row][Column])
          cell.t = 's'
        }

        if (Row !== 0) {
          for (let i = 0; i < dataLength; i += 1) {
            let type: XLSX.ExcelDataType = 'z'

            if (_.isString(mapData[Row][Column])) {
              type = 's'
            }

            if (isNumeric(mapData[Row][Column])) {
              type = 'n'
            }

            if (mapData[Row][Column] instanceof Date) {
              type = 'd'
            }

            cell.v = mapData[Row][Column]
            cell.t = type
          }
        }

        worksheet[cellRef] = cell
      }
    }

    worksheet['!ref'] = XLSX.utils.encode_range(rangeSheet)

    // create workbook
    const workbook: XLSX.WorkBook = {
      SheetNames: ['Sheet1'],
      Sheets: { Sheet1: worksheet },
    }

    // write file excel
    await XLSX.writeFile(workbook, outputPath, { bookType: 'xlsx' })
  }
}
