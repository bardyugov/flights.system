import { Reflector } from '@nestjs/core'
import { GlobalRoles } from '@flights.system/shared'

const Roles = Reflector.createDecorator<GlobalRoles[]>()

export { Roles }
