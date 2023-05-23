import excelToJson from 'convert-excel-to-json'
import * as ExcelJS from 'exceljs'
import fs from 'fs'
import * as XLSX from 'xlsx'

interface OptionConvert {
  header?: any
  columnToKey?: any
}

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
  private _getSheetName(filePath: string | Buffer): any {
    const excelPath = fs.readFileSync(filePath)

    const result = new Uint8Array(excelPath)
    const XLSXRead = XLSX.read(result, { type: 'array' })

    const getSheetname = XLSXRead.SheetNames[0]

    return getSheetname
  }

  /**
   *
   * @param filePath
   * @returns
   */
  public sheetToJson<T>(filePath: string | Buffer): T[] {
    const excelPath = fs.readFileSync(filePath)

    const result = new Uint8Array(excelPath)
    const XLSXRead = XLSX.read(result, { type: 'array' })

    const getSheetname = XLSXRead.SheetNames[0]
    const getWorksheet = XLSXRead.Sheets[getSheetname]

    const XLSXJson: T[] = XLSX.utils.sheet_to_json(getWorksheet)

    return XLSXJson
  }

  /**
   *
   * @param path
   * @param options
   * @returns
   */
  public convertToJson<T>(
    filePath: string | Buffer,
    options?: OptionConvert
  ): T[] {
    const resultConvert = excelToJson({
      source: fs.readFileSync(filePath), // fs.readFileSync return a Buffer
      header: options?.header || {
        rows: 1,
      },
      columnToKey: options?.columnToKey || {
        '*': '{{columnHeader}}',
      },
    })

    const getSheetname = this._getSheetName(filePath)
    const newSheet = resultConvert[getSheetname]

    return newSheet
  }
}
