type FlightInsertQuery = {
   landingTime: Date
   departureTime: Date
   from: () => string
   to: () => string
}

type AirplaneInsertQuery = {
   pid: number
   amountPlaces: number
   status: () => string
   currentCity: () => string
}

export { FlightInsertQuery, AirplaneInsertQuery }
