import { LoggerService } from '@nestjs/common'
import * as winston from 'winston'

class MyLoggerService implements LoggerService {
  private readonly logger: winston.Logger
  private readonly context: string

  private readonly baseFormat: winston.Logform.Format[] = [
    winston.format.timestamp(),
    winston.format.simple(),
    winston.format.printf(({ level, message, timestamp, context, trace }) => {
      const strContext = context ? `[${context}]` : ''
      const strTrace = trace ? `[${trace}]` : ''
      if (trace) {
        return `[${timestamp}] ${strContext} ${level} ${strTrace} ${message}`
      }

      return `[${timestamp}] ${strContext} ${level} ${message}`
    })
  ]

  constructor(context: string) {
    this.context = context
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

  log(message: string, data?: { context?: string, trace: string }) {
    this.logger.info({ message, context: data?.context ?? this.context, trace: data?.trace })
  }

  error(message: string, data?: { context?: string, trace: string }) {
    this.logger.error({ message, context: data?.context ?? this.context, trace: data?.trace })
  }

  debug(message: string, data?: { context?: string, trace: string }) {
    this.logger.debug({ message, context: data?.context ?? this.context, trace: data?.trace })
  }

  warn(message: string, data?: { context?: string, trace: string }) {
    this.logger.warn({ message, context: data?.context ?? this.context, trace: data?.trace })
  }
}

export { MyLoggerService }
