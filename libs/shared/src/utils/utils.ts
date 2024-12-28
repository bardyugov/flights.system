import { LogEntry, logLevel } from 'kafkajs'
import { Logger } from '@nestjs/common'

enum InjectServices {
    ConsumerService = 'ConsumerService',
    ProducerService = 'ProducerService'
}

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

function initKafkaLogger(
    level: logLevel,
    logger: Logger,
    serviceName: string
): (entry: LogEntry) => void {
    return entry => {
        switch (level) {
            case logLevel.ERROR:
                logger.error(buildKafkaLogMessage(entry), serviceName)
                break
            case logLevel.NOTHING:
                logger.log(buildKafkaLogMessage(entry), serviceName)
                break
            case logLevel.WARN:
                logger.warn(buildKafkaLogMessage(entry), serviceName)
                break
            case logLevel.INFO:
                logger.log(buildKafkaLogMessage(entry), serviceName)
                break
            case logLevel.DEBUG:
                logger.debug(buildKafkaLogMessage(entry), serviceName)
                break
        }
    }
}

export { InjectServices, parseArrayFromConfig, initKafkaLogger }
