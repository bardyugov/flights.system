class CreatedCityRes {
  readonly name: string
  readonly country: string
  readonly createAt: Date
}

class AuthTokenResponse {
  readonly access: string
  readonly refresh: string
}

export { CreatedCityRes, AuthTokenResponse }
