import { Injectable, Logger } from '@nestjs/common'
import * as winston from 'winston'

@Injectable()
class LoggerService extends Logger {
   private readonly logger: winston.Logger

   constructor(context: string) {
      super(context)

      this.logger = winston.createLogger({
         level: 'info',
         format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple()
         ),
         transports: [
            new winston.transports.Console(),
            new winston.transports.File({
               dirname: './logs/info',
               filename: 'info.log',
               level: 'info'
            }),
            new winston.transports.File({
               dirname: './logs/warn',
               filename: 'warn.log',
               level: 'warn'
            }),
            new winston.transports.File({
               dirname: './logs/debug',
               filename: 'debug.log',
               level: 'debug'
            }),
            new winston.transports.File({
               dirname: './logs/error',
               filename: 'error.log',
               level: 'error'
            })
         ]
      })
   }

   log(message: string, context?: string) {
      this.logger.info(message, { context })
   }

   error(message: string, trace?: string, context?: string) {
      this.logger.error(message, { trace, context })
   }

   debug(message: string, context?: string) {
      this.logger.debug(message, { context })
   }

   warn(message: string, context?: string) {
      this.logger.warn(message, { context })
   }
}

export { LoggerService }
