import { ApiProperty } from '@nestjs/swagger'
import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

const createCityReqCred = z.object({
   name: z.string().min(5, 'Name length > 5'),
   country: z.string().min(5, 'Country length > 5')
})

const getCityReqCred = z.object({
   offset: z.number().gt(1, 'Offset must be > 1'),
   limit: z.number().gte(20, 'Limit must bet <= 20')
})

const employeesRolesCred = z.enum(['pilot', 'stewardess', 'client'])

const registerEmployeeReqCred = z.object({
   name: z.string().min(5).max(23),
   surname: z.string().min(5).max(23),
   lastName: z.string().min(5).max(23),
   birthDate: z
      .string()
      .datetime()
      .transform(v => new Date(v)),
   password: z.string().min(5).max(23),
   role: employeesRolesCred
})

const registerClientOnFlightCred = z.object({
   from: z.string().min(3).max(23),
   to: z.string().min(3).max(23)
})

type EmployeeRoles = z.infer<typeof employeesRolesCred>

class CreateCityReq extends createZodDto(createCityReqCred) {
   @ApiProperty({ type: 'string', description: 'Name of city' })
   name: string

   @ApiProperty({ type: 'string', description: 'Country of city' })
   country: string

   constructor(name: string, country: string) {
      super()
      this.name = name
      this.country = country
   }
}

class GetCityReq extends createZodDto(getCityReqCred) {
   @ApiProperty({ type: 'number', description: 'Offset for getting city' })
   offset: number
   @ApiProperty({ type: 'number', description: 'Limit for getting city' })
   limit: number

   constructor(offset: number, limit: number) {
      super()
      this.offset = offset
      this.limit = limit
   }
}

class RegisterEmployeeReq extends createZodDto(registerEmployeeReqCred) {
   @ApiProperty({ type: 'string', description: 'Employee name' })
   name: string

   @ApiProperty({ type: 'string', description: 'Employee surname' })
   surname: string

   @ApiProperty({ type: 'string', description: 'Employee lastName' })
   lastName: string

   @ApiProperty({
      type: 'string',
      format: 'date-time',
      description: 'Employee birthDate',
      example: '2023-01-01T00:00:00Z'
   })
   birthDate: Date

   @ApiProperty({ type: 'string', description: 'Employee password' })
   password: string

   @ApiProperty({
      type: 'string',
      description: 'Employee role',
      example: 'pilot || stewardess || client'
   })
   role: EmployeeRoles
}

class PaymentReq {
   constructor(readonly clientId: number, readonly flightId: number) {}
}

class ReservationPlaceReq {
   constructor(readonly from: string, readonly to: string) {}
}

class RegisterOnFlightReq extends createZodDto(registerClientOnFlightCred) {
   @ApiProperty({ type: 'string', description: 'City name' })
   from: string

   @ApiProperty({ type: 'string', description: 'Employee surname' })
   to: string

   constructor(from: string, to: string) {
      super()
      this.from = from
      this.to = to
   }
}

class AddFlightJournalReq {
   constructor(readonly flightId: number, readonly clientId: number) {}
}

export {
   CreateCityReq,
   GetCityReq,
   RegisterEmployeeReq,
   EmployeeRoles,
   PaymentReq,
   ReservationPlaceReq,
   AddFlightJournalReq,
   RegisterOnFlightReq
}
