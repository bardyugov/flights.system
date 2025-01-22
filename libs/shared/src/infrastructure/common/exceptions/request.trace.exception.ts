class RequestTraceException extends Error {
   constructor(readonly message: string) {
      super(message)
   }
}

export { RequestTraceException }
