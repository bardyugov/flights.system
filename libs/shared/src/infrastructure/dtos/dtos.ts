import { ApiProperty } from '@nestjs/swagger'

class CreateCityReq {
  @ApiProperty({ type: 'string', description: 'Name of city' })
  readonly name: string

  @ApiProperty({ type: 'string', description: 'Country of city' })
  readonly country: string

  constructor(name: string, country: string) {
    this.name = name
    this.country = country
  }
}

class CreatedCityRes {
  readonly name: string
  readonly country: string
  readonly createAt: Date
}

class GetCityReq {
  @ApiProperty({ type: 'number', description: 'Offset for getting city' })
  readonly offset: number
  @ApiProperty({ type: 'number', description: 'Limit for getting city' })
  readonly limit: number

  constructor(offset: number, limit: number) {
    this.offset = offset
    this.limit = limit
  }
}

export { CreateCityReq, CreatedCityRes, GetCityReq }
