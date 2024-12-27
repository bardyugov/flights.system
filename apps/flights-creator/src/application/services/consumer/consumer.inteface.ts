import { EachMessagePayload } from 'kafkajs'

interface IConsumerService {
    connect(): Promise<void>
    subscribe(
        topic: string,
        callback: (message: EachMessagePayload) => Promise<void>
    ): Promise<void>
    disconnect(): Promise<void>
}

export { IConsumerService }
