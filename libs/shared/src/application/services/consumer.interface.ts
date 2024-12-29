import { Topic } from '../../infrastructure/services/kafka'

interface IConsumerService {
    connect(): Promise<void>
    subscribeWithReply<Req, Res>(
        topic: Topic,
        callback: (message: Req) => Promise<Res>
    ): Promise<void>
    subscribe<Req>(
        topic: Topic,
        callback: (message: Req) => Promise<unknown>
    ): Promise<void>
    disconnect(): Promise<void>
}

export { IConsumerService }
