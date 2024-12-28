import { EachMessagePayload } from 'kafkajs'

interface IConsumerService {
    connect(): Promise<void>
    send(
        topic: string,
        callback: (message: EachMessagePayload) => Promise<unknown>
    ): Promise<void>
    emit(
        topic: string,
        callback: (message: EachMessagePayload) => Promise<void>
    ): Promise<void>
    disconnect(): Promise<void>
}

export { IConsumerService }
