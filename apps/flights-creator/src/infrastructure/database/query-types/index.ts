type FlightInsertQuery = {
    landingTime: Date
    departureTime: Date
    from: () => string
    to: () => string
}

type AirplaineInsertQuery = {
    pid: number
    amountPlaces: number
    statusId: number
    currentCityId: number
}

export { FlightInsertQuery, AirplaineInsertQuery }
