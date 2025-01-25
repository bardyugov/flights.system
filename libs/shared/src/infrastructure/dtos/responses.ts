class CreatedCityRes {
   constructor(
      readonly name: string,
      readonly country: string,
      readonly createAt: Date
   ) {}
}

class AuthTokenRes {
   constructor(readonly access: string, readonly refresh: string) {}
}

class GetAirplanesRes {
   constructor(readonly id: number, readonly pid: number) {}
}

class PaymentRes {
   constructor(
      readonly paymentId: number,
      readonly createAt: Date,
      readonly amount: number
   ) {}
}

class ReservationPlaceRes {
   constructor(readonly flightId: number) {}
}

export {
   CreatedCityRes,
   AuthTokenRes,
   GetAirplanesRes,
   PaymentRes,
   ReservationPlaceRes
}
