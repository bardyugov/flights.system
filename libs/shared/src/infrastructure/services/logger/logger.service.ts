import { ConsoleLogger } from '@nestjs/common'
import * as winston from 'winston'

class LoggerService extends ConsoleLogger {
   private readonly logger: winston.Logger
   private readonly baseFormat: winston.Logform.Format[] = [
      winston.format.timestamp(),
      winston.format.simple(),
      winston.format.printf(({ level, message, timestamp, context }) => {
         return level === 'info'
            ? `[${timestamp}] ${
                 context ? `[${context}]` : ''
              } ${level} ${message} `
            : undefined
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
            new winston.transports.File({
               dirname: './logs/info',
               filename: 'info.log',
               level: 'info',
               format: winston.format.combine(...this.baseFormat)
            }),
            new winston.transports.File({
               dirname: './logs/warn',
               filename: 'warn.log',
               level: 'warn',
               format: winston.format.combine(...this.baseFormat)
            }),
            new winston.transports.File({
               dirname: './logs/debug',
               filename: 'debug.log',
               level: 'debug',
               format: winston.format.combine(...this.baseFormat)
            }),
            new winston.transports.File({
               dirname: './logs/error',
               filename: 'error.log',
               level: 'error',
               format: winston.format.combine(...this.baseFormat)
            })
         ]
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
