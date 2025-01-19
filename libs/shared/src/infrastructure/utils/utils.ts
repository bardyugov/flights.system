import { LogEntry, logLevel } from 'kafkajs'
import { Request } from 'express'
import { LoggerService } from '@nestjs/common'
import * as path from 'path'
import { EmployeeRole } from '../dtos'

enum InjectServices {
  ConsumerService = 'ConsumerService',
  ProducerService = 'ProducerService',
  CityService = 'CityService',
  CityServiceLogger = 'CityServiceLogger',
  AccumulatorServiceLogger = 'AccumulatorServiceLogger',
  AuthService = 'AuthService',
  AuthServiceLogger = 'AuthServiceLogger'
}

type GlobalRole = EmployeeRole | 'client'

type Ok<T> = {
  state: 'ok'
  value: T
}

type Error = {
  state: 'error'
  message: string
}

function ok<T>(value: T): Ok<T> {
  return {
    state: 'ok',
    value: value
  }
}

function error(msg: string): Error {
  return {
    state: 'error',
    message: msg
  }
}

type KafkaResult<T> = Ok<T> | Error

type KafkaRequest<T> = {
  data: T
  traceId: string
}

interface RequestTrace extends Request {
  traceId: string
}

type ValidationResult = {
  [key: number]: string
}

type JwtPayload = {
  id: number
  role: GlobalRole
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
  try {
    const stringBuffer = buffer.toString()
    const value: T = JSON.parse(stringBuffer)
    return value
  } catch (e) {
    return null
  }
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
  return path.join(
    __dirname,
    `./assets/.${process.env.NODE_ENV}.env`
  )
}

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
  GlobalRole
}
