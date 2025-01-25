import { Topic } from '../../infrastructure/services'
import { KafkaRequest, KafkaResult } from '../../infrastructure/utils/utils'

interface IProducerService {
   connect(): Promise<void>

   produceWithReply<Req, Res>(
      topic: Topic,
      data: KafkaRequest<Req>
   ): Promise<KafkaResult<Res>>

   produce<Req>(topic: Topic, data: KafkaRequest<Req>): Promise<void>

   subscribeOfReply(topic: Topic): Promise<void>

   disconnect(): Promise<void>
}

export { IProducerService }
