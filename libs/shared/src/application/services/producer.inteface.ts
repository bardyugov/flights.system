import { Topic } from '../../infrastructure/services'

interface IProducerService {
  connect(): Promise<void>

  produceEmptyMsgWithReply<Res>(topic: Topic): Promise<Res>

  produceWithReply<Req, Res>(topic: Topic, data: Req): Promise<Res>

  produce<Req>(topic: Topic, data: Req): Promise<void>

  subscribeOfReply(topic: Topic): Promise<void>

  disconnect(): Promise<void>
}

export { IProducerService }
