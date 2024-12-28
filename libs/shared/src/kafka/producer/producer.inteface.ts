interface IProducerService {
    produce<T extends object>(topic: string, data: T): Promise<void>
    disconnect(): Promise<void>
}

export { IProducerService }
