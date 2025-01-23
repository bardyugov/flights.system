import { Reflector } from '@nestjs/core'
import { EmployeeRoles } from '@flights.system/shared'

const Roles = Reflector.createDecorator<EmployeeRoles[]>()

export { Roles }
