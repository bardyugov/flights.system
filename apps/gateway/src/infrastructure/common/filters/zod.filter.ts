import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { ZodValidationException } from 'nestjs-zod'
import { Response } from 'express'
import { ValidationResult } from '@flights.system/shared'

@Catch(ZodValidationException)
export class ZodFilter implements ExceptionFilter {
  catch(exception: ZodValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()
    const errors = exception.getZodError()
    const validationResult = errors.issues.reduce(
      (acc, v, index) => ({ ...acc, [index]: v.message }),
      {} as ValidationResult
    )
    response.status(status).json(validationResult)
  }
}
