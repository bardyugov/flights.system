import { RegisterOnFlightReq } from '../dtos'

class RegisterOnFlightCmd extends RegisterOnFlightReq {
   traceId: string
   clientId: number

   constructor(from: string, to: string, traceId: string, clientId: number) {
      super(from, to)
      this.traceId = traceId
      this.clientId = clientId
   }
}

class MessageResult {
   constructor(readonly message: string) {}
}

export { RegisterOnFlightCmd, MessageResult }
