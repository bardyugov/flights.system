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

class CreateCityReq extends createZodDto(createCityReqCred) {
  @ApiProperty({ type: 'string', description: 'Name of city' })
  city: string

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

export {
  CreateCityReq,
  GetCityReq
}
