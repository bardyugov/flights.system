import { Injectable, NestMiddleware } from '@nestjs/common'
import { Response } from 'express'
import { uuid as v4 } from 'uuidv4'
import { RequestTrace } from '@flights.system/shared'

@Injectable()
class TraceIdMiddleware implements NestMiddleware {
   use(req: RequestTrace, res: Response, next: () => void): void {
      const traceId = v4()

      req.traceId = traceId
      res.setHeader('X-Trace-Id', traceId)

      next()
   }
}

export { TraceIdMiddleware }
