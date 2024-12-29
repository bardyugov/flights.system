type CityCreateReq = {
    readonly name: string
}

type CityCreateRes = {
    readonly id: string
    readonly name: string
}

type AirplaneCreateReq = {
    readonly PID: string
    readonly name: string
}

export { CityCreateReq, CityCreateRes, AirplaneCreateReq }
