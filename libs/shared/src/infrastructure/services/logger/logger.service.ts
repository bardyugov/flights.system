import { ConsoleLogger } from '@nestjs/common'
import * as winston from 'winston'

class LoggerService extends ConsoleLogger {
  private readonly logger: winston.Logger
  private readonly baseFormat: winston.Logform.Format[] = [
    winston.format.timestamp(),
    winston.format.simple(),
    winston.format.printf(({ level, message, timestamp, context }) => {
      return `[${timestamp}] ${
        context ? `[${context}]` : ''
      } ${level} ${message} `
    })
  ]

  constructor(context: string) {
    super(context)
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            ...this.baseFormat
          )
        }),
        this.buildLoggerTransport('debug'),
        this.buildLoggerTransport('info'),
        this.buildLoggerTransport('warn'),
        this.buildLoggerTransport('debug')
      ]
    })
  }

  private buildLoggerTransport(level: string) {
    const validateLevel = winston.format(info => {
      return info.level === level ? info : false
    })

    return new winston.transports.File({
      dirname: `./logs/${level}`,
      filename: `${level}.log`,
      level: level,
      format: winston.format.combine(validateLevel(), ...this.baseFormat)
    })
  }

  log(message: string) {
    console.log('Log level')
    this.logger.info(message, { context: this.context })
  }

  error(message: string, trace?: string) {
    this.logger.error(message, { trace, context: this.context })
  }

  debug(message: string) {
    console.log('Debug level')
    this.logger.debug(message, { context: this.context })
  }

  warn(message: string) {
    this.logger.warn(message, { context: this.context })
  }
}

export { LoggerService }
