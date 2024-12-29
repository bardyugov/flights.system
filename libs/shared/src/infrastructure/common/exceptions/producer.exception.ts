class NotFoundReplyTopicException extends Error {
    constructor(readonly message: string) {
        super(message)
    }
}

class NotParsedBuffer extends Error {
    constructor(readonly message: string) {
        super(message)
    }
}

export { NotFoundReplyTopicException, NotParsedBuffer }
