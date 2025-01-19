import { LoggerService } from '@nestjs/common'
import * as winston from 'winston'
import LogstashTransport from 'winston-logstash/lib/winston-logstash-latest'
import { ConfigService } from '@nestjs/config'
import { initConfigPath } from '../../utils/utils'

class MyLoggerService implements LoggerService {
   private readonly logger: winston.Logger
   private readonly context: string

   constructor(context: string, config: ConfigService) {
      this.context = context
      this.logger = winston.createLogger({
         transports: [
            new winston.transports.Console({
               format: winston.format.combine(
                  winston.format.colorize(),
                  winston.format.timestamp(),
                  winston.format.simple(),
                  winston.format.printf(
                     ({ level, message, timestamp, context, trace }) => {
                        const strContext = context ? `[${context}]` : ''
                        const strTrace = trace ? `[${trace}]` : ''
                        if (trace) {
                           return `[${timestamp}] ${strContext} ${level} ${strTrace} ${message}`
                        }

                        return `[${timestamp}] ${strContext} ${level} ${message}`
                     }
                  )
               )
            }),
            new LogstashTransport({
               host: config.get<string>('LOGSTASH_HOST'),
               port: config.get<string>('LOGSTASH_PORT'),
               max_connect_retries: -1,
               format: winston.format.combine(
                  winston.format.timestamp(),
                  winston.format.simple()
               )
            })
         ]
      })
   }

   static createBootstrapLogger() {
      const config = new ConfigService({
         envFile: initConfigPath()
      })

      return new MyLoggerService('Bootstrap', config)
   }

   log(message: string, data?: { context?: string; trace: string }) {
      this.logger.info({
         message,
         context: data?.context ?? this.context,
         trace: data?.trace
      })
   }

   error(message: string, data?: { context?: string; trace: string }) {
      this.logger.error({
         message,
         context: data?.context ?? this.context,
         trace: data?.trace
      })
   }

   debug(message: string, data?: { context?: string; trace: string }) {
      this.logger.debug({
         message,
         context: data?.context ?? this.context,
         trace: data?.trace
      })
   }

   warn(message: string, data?: { context?: string; trace: string }) {
      this.logger.warn({
         message,
         context: data?.context ?? this.context,
         trace: data?.trace
      })
   }
}

export { MyLoggerService }
