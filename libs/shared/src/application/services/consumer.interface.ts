import { Topic } from '../../infrastructure/services'
import { KafkaRequest, KafkaResult } from '../../infrastructure/utils/utils'

interface IConsumerService {
   connect(): Promise<void>
   subscribeWithReply<Req, Res>(
      topic: Topic,
      callback: (message: KafkaRequest<Req>) => Promise<KafkaResult<Res>>
   ): Promise<void>
   subscribe<Req>(
      topic: Topic,
      callback: (message: KafkaRequest<Req>) => Promise<unknown>
   ): Promise<void>
   disconnect(): Promise<void>
}

export { IConsumerService }
