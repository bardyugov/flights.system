import { LogEntry, logLevel } from 'kafkajs'
import { Logger } from '@nestjs/common'

enum InjectServices {
    ConsumerService = 'ConsumerService',
    ProducerService = 'ProducerService'
}

/*type KafkaMessagePayload<T extends object> = {
    value: T
}*/

function parseArrayFromConfig(value: string) {
    if (value === '' || !value) {
        return []
    }
    return value.split(';').map(t => t.trim())
}

function buildKafkaLogMessage(entry: LogEntry) {
    return JSON.stringify({
        level: entry.level,
        label: entry.label,
        message: entry.log.message
    })
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
    logger: Logger
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

export {
    InjectServices,
    parseArrayFromConfig,
    initKafkaLogger,
    buildReplyTopic,
    safelyParseBuffer
}
