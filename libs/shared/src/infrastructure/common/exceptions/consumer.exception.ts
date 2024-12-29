class ConsumerException extends Error {
    constructor(readonly message: string) {
        super(message)
    }
}

export { ConsumerException }
