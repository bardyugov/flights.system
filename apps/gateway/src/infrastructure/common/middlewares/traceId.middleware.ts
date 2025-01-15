import { Injectable, NestMiddleware } from '@nestjs/common'
import { Response } from 'express'
import { uuid } from 'uuidv4'
import { RequestTrace } from '@flights.system/shared'

@Injectable()
class TraceIdMiddleware implements NestMiddleware {
  use(req: RequestTrace, res: Response, next: () => void): void {
    const traceId = uuid()

    req.traceId = uuid()
    res.setHeader('X-Trace-Id', traceId)

    next()
  }
}

export { TraceIdMiddleware }
