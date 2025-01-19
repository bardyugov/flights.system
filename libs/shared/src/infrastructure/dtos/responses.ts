class CreatedCityRes {
   readonly name: string
   readonly country: string
   readonly createAt: Date
}

class AuthTokenRes {
   readonly access: string
   readonly refresh: string
}

class GetAirplanesRes {
   readonly id: number
   readonly pid: number
}

export { CreatedCityRes, AuthTokenRes, GetAirplanesRes }
