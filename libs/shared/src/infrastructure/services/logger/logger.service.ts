import { Injectable, Logger, LoggerService } from '@nestjs/common'
import * as winston from 'winston'

class MyLoggerService extends Logger implements LoggerService {
   private readonly logger: winston.Logger

   constructor(private readonly context: string) {
      super(context)
      this.logger = winston.createLogger({
         level: 'info',
         format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
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

   log(message: string) {
      this.logger.info(message, { context: this.context })
   }

   error(message: string, trace?: string) {
      this.logger.error(message, { trace, context: this.context })
   }

   debug(message: string) {
      this.logger.debug(message, { context: this.context })
   }

   warn(message: string) {
      this.logger.warn(message, { context: this.context })
   }
}

export { MyLoggerService }
