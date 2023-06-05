import chalk from 'chalk'
import winston, { format } from 'winston'

// custom format log console
const myFormat = format.printf(({ level, message, label, timestamp }) => {
  const logLabel = chalk.green(`[${label}]:`)
  const logLevel = chalk.blue(`logger - ${level}`)
  const logTime = chalk.cyan(timestamp)

  return `${logLabel} ${logLevel} - ${logTime} ${message}`
})

type TLevel = 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug'

interface ILogger {
  filePath: string
  level?: {
    log?: TLevel
    console?: TLevel
  }
  maxSize?: number
  maxFiles?: number
}

export class Logger {
  private readonly filePath: string
  private readonly logLevel?: TLevel
  private readonly consoleLevel?: TLevel
  private readonly maxSize?: number
  private readonly maxFiles?: number

  constructor(params: ILogger) {
    this.filePath = params.filePath
    this.logLevel = params?.level?.log
    this.consoleLevel = params?.level?.console
    this.maxSize = params?.maxSize
    this.maxFiles = params?.maxFiles
  }

  /**
   * Logger Options
   * define the custom settings for each transport (file, console)
   * @returns
   */
  private _loggerOptions(): {
    file: winston.transports.FileTransportOptions
    console: winston.transports.ConsoleTransportOptions
  } {
    const options = {
      file: {
        level: this.logLevel ?? 'error', // error, warn, info, http, verbose, debug, silly
        filename: this.filePath,
        format: winston.format.json(),
        handleExceptions: true,
        maxsize: this.maxSize ?? 5 * 1024 * 1024, // 5MB
        maxFiles: this.maxFiles ?? 5,
      },
      console: {
        level: this.consoleLevel ?? 'debug',
        format: winston.format.combine(
          format.label({ label: 'server' }),
          format.timestamp({ format: 'DD/MMM/YYYY HH:mm:ss' }),
          myFormat
        ),
      },
    }

    return options
  }

  /**
   * Initialize Logger
   * @returns
   */
  public initialize(): winston.Logger {
    const { file, console } = this._loggerOptions()

    const winstonLogger = winston.createLogger({
      transports: [
        new winston.transports.File(file),
        new winston.transports.Console(console),
      ],
      exitOnError: false,
    })

    return winstonLogger
  }

  /**
   * Stream Logger
   * create a stream object with a 'write' function that will be used by `morgan`
   * @returns
   */
  public stream(): any {
    const winstonStream = {
      write: (message: string) => {
        this.initialize().info(message)
      },
    }

    return winstonStream
  }
}
