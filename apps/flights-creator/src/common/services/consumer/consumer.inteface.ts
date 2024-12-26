interface IConsumerService {
    connect(): Promise<void>
    subscribe<T>(topic: string, callback: (message: T) => void): Promise<void>
    disconnect(): Promise<void>
}

export { IConsumerService }
