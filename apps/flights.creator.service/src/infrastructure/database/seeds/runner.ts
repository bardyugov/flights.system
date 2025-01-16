import { runSeeder } from 'typeorm-extension'
import context from '../database.context'
import { CitySeeder } from './seeders/city.seeder'
import { AirplaneStatusSeeder } from './seeders/airplane.status.seeder'
import { FlightSeeder } from './seeders/flight.seeder'
import { AirplaneSeeder } from './seeders/airplane.seeder'

async function run() {
  await context.initialize()
  await runSeeder(context, CitySeeder)
  await runSeeder(context, AirplaneStatusSeeder)
  await runSeeder(context, FlightSeeder)
  await runSeeder(context, AirplaneSeeder)
}

run()
