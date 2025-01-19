import { runSeeder } from 'typeorm-extension'
import context from '../database.context'
import { EmployeeStatusSeeder } from './seeds/employee.status.seed'

async function run() {
   await context.initialize()
   await runSeeder(context, EmployeeStatusSeeder)
}

run()
