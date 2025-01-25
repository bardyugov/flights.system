enum Topic {
   CITY_CREATE = 'city.create.topic',
   CITY_CREATE_REPLY = 'city.create.topic.reply',

   CITY_GET = 'city.get.topic',
   CITY_GET_REPLY = 'city.get.topic.reply',

   CITY_FIND_BY_NAME = 'city.find.topic',
   CITY_FIND_BY_NAME_REPLY = 'city.find.topic.reply',

   AUTH_REGISTER_EMPLOYEE = 'auth.register.employee.topic',
   AUTH_REGISTER_EMPLOYEE_REPLY = 'auth.register.employee.topic.reply',

   AUTH_REFRESH_TOKEN = 'auth.refresh.token.topic',
   AUTH_REFRESH_TOKEN_REPLY = 'auth.refresh.token.topic.reply',

   AUTH_LOGOUT = 'auth.logout.topic',
   AUTH_LOGOUT_REPLY = 'auth.logout.topic.reply',

   AIRPLANE_GET = 'airplane.get.topic',
   AIRPLANE_GET_REPLY = 'airplane.get.topic.reply',

   PAYMENT = 'payment.invoke.topic',
   PAYMENT_REPLY = 'payment.invoke.topic.reply',
   PAYMENT_COMPENSATION = 'payment.compensation.topic',

   FLIGHT_RESERVATION_PLACE = 'flight.reservation.place.topic',
   FLIGHT_RESERVATION_PLACE_REPLY = 'flight.reservation.place.topic.reply',
   FLIGHT_RESERVATION_PLACE_COMPENSATION = 'flight.reservation.place.compensation.topic',

   FLIGHT_JOURNAL = 'flights.journal.topic',
   FLIGHT_JOURNAL_REPLY = 'flights.journal.topic.reply',
   FLIGHT_JOURNAL_COMPENSATION = 'flights.journal.compensation.topic'
}

export { Topic }
