import { Subject } from 'rxjs'
import { Topic } from '../../infrastructure/services/kafka'

interface IProducerService {
    produceWithReply<Req, Res>(topic: Topic, data: Req): Promise<Subject<Res>>
    produce<Req>(topic: Topic, data: Req): Promise<void>
    subscribeOfReply(topic: Topic): Promise<void>
    disconnect(): Promise<void>
}

export { IProducerService }
