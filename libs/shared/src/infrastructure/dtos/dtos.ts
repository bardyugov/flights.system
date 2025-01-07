type CreateCityReq = {
    readonly name: string
    readonly country: string
}

type CreatedCityRes = {
    readonly name: string
    readonly country: string
    readonly createAt: Date
}

export { CreateCityReq, CreatedCityRes }
