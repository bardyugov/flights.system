class SagaException extends Error {
   constructor(readonly message: string) {
      super(message)
   }
}

export { SagaException }
