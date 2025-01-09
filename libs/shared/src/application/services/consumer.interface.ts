import { Topic } from '../../infrastructure/services'

interface IConsumerService {
   connect(): Promise<void>
   subscribeEmptyMsgWithReply<Res>(
      topic: Topic,
      callback: () => Promise<Res>
   ): Promise<void>
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
