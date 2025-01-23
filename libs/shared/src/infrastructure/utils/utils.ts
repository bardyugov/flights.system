import { LogEntry, logLevel } from 'kafkajs'
import { Request } from 'express'
import { LoggerService } from '@nestjs/common'
import * as path from 'path'
import { EmployeeRoles } from '../dtos'

enum InjectServices {
   ConsumerService = 'IConsumerService',
   ProducerService = 'IProducerService',
   CityService = 'ICityService',
   AuthService = 'IAuthService',
   AirplaneService = 'IAirplaneService',
   JwtService = 'IJwtService',
   PaymentService = 'IPaymentService'
}

type Ok<T> = {
   state: 'ok'
   value: T
}

type Error = {
   state: 'error'
   message: string
}

type KafkaResult<T> = {
   traceId: string
   data: Ok<T> | Error
}

type KafkaRequest<T> = {
   traceId: string
   data?: T
}

function ok<T>(value: T, traceId: string): KafkaResult<T> {
   return {
      traceId: traceId,
      data: {
         state: 'ok',
         value: value
      }
   }
}

function error<T>(msg: string, traceId: string): KafkaResult<T> {
   return {
      traceId: traceId,
      data: {
         state: 'error',
         message: msg
      }
   }
}

type ValidationResult = {
   [key: number]: string
}

type JwtPayload = {
   id: number
   role: EmployeeRoles
}

interface RequestTrace extends Request {
   traceId: string
   user: JwtPayload
}

function parseArrayFromConfig(value: string) {
   if (value === '' || !value) {
      return []
   }
   return value.split(';').map(t => t.trim())
}

function buildKafkaLogMessage(entry: LogEntry) {
   return `${entry.log.message}`
}

function buildReplyTopic(topic: string) {
   return `${topic}.reply`
}

function safelyParseBuffer<T>(buffer: Buffer) {
   const stringBuffer = buffer.toString()
   const value: T = JSON.parse(stringBuffer)
   return value
}

function initKafkaLogger(
   level: logLevel,
   logger: LoggerService
): (entry: LogEntry) => void {
   return entry => {
      switch (level) {
         case logLevel.ERROR:
            logger.error(buildKafkaLogMessage(entry))
            break
         case logLevel.NOTHING:
            logger.log(buildKafkaLogMessage(entry))
            break
         case logLevel.WARN:
            logger.warn(buildKafkaLogMessage(entry))
            break
         case logLevel.INFO:
            logger.log(buildKafkaLogMessage(entry))
            break
         case logLevel.DEBUG:
            logger.debug(buildKafkaLogMessage(entry))
            break
      }
   }
}

function initConfigPath() {
   return path.join(__dirname, `./assets/.${process.env.NODE_ENV}.env`)
}

const JWT_AUTH = 'JWT_AUTH'

export {
   InjectServices,
   parseArrayFromConfig,
   initKafkaLogger,
   buildReplyTopic,
   safelyParseBuffer,
   KafkaResult,
   ok,
   error,
   RequestTrace,
   KafkaRequest,
   initConfigPath,
   ValidationResult,
   JwtPayload,
   JWT_AUTH
}
