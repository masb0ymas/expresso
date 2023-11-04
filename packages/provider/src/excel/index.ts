import excelToJson from 'convert-excel-to-json'
import * as ExcelJS from 'exceljs'
import { isNumeric, validateNumber } from 'expresso-core'
import fs from 'fs'
import { isString } from 'lodash'
import * as XLSX from 'xlsx'
import { ExcelOptionConvert } from './types'

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
   * @deprecated
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
    options?: ExcelOptionConvert
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

    const getSheetname = options?.sheetName || 'Sheet1'
    const newSheet = resultConvert[getSheetname]

    return newSheet
  }

  /**
   *
   * @param columnNumber
   * @returns
   */
  public getCellTitle(columnNumber: number) {
    let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let lastChar = ''
    let title = ''

    while (columnNumber) {
      lastChar = alphabet[(columnNumber - 1) % 26]

      // Every 1 complete iteration, there is a new letter or an upgrade of the previous one
      // The number of iterations points to the letter in the alphabet
      //  0 iteration(s) => A  1
      //  1 iteration(s) => AA 27
      //  2 iteration(s) => BA 53
      //  3 iteration(s) => CA 79
      //  4 iteration(s) => DA 105
      // ...
      // 26 iteration(s) => ZA 677
      columnNumber = Math.floor((columnNumber - 1) / 26)

      title = lastChar + title
    }

    return title
  }

  /**
   *
   * @param columnTitle
   * @returns
   */
  public getCellNumber(columnTitle: string) {
    let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let lastChar = columnTitle[columnTitle.length - 1]
    let columnNumber = alphabet.indexOf(lastChar) + 1

    for (var i = 1, iterations = 0; i < columnTitle.length; i++) {
      lastChar = columnTitle[columnTitle.length - (i + 1)]

      // AA   => 1   iteration(s)
      // BA   => 2   iteration(s)
      // AAA  => 27  iteration(s)
      // BAA  => 53  iteration(s)
      // CAA  => 79  iteration(s)
      // ZAA  => 677 iteration(s)
      // AAAA => 703 iteration(s)
      iterations += (alphabet.indexOf(lastChar) + 1) * 26 ** (i - 1)
    }

    columnNumber += iterations * 26

    return columnNumber
  }

  /**
   *
   * @param value
   * @returns
   */
  private _toCellColumn(value: number): string {
    const mod = value % 26
    let pow = (value / 26) | 0
    const out = mod ? String.fromCharCode(64 + mod) : (pow--, 'Z')

    return pow ? this._toCellColumn(pow) + out : out
  }

  /**
   *
   * @param value
   * @returns
   */
  private _fromCellColumn(value: string): number {
    let out = 0
    const len = value.length
    let pos = len

    while ((pos -= 1) > -1) {
      out += (value.charCodeAt(pos) - 64) * Math.pow(26, len - 1 - pos)
    }

    return out
  }

  /**
   *
   * @param cell
   * @returns
   */
  public mappingCell(cell?: string | number) {
    const result = []

    let cellLength = 26

    if (isNumeric(cell)) {
      cellLength = validateNumber(cell)
    } else if (isString(cell)) {
      cellLength = this.getCellNumber(cell)
    }

    for (let i = 1, n; i <= cellLength; i += 1) {
      const alphabet = (n = this._toCellColumn(i))

      result.push(alphabet)
    }

    return result
  }
}
