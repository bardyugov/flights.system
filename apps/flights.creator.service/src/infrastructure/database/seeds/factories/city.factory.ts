import { CityEntity } from '../../../entities/city.entity'
import { setSeederFactory } from 'typeorm-extension'

export default setSeederFactory(CityEntity, faker => {
   const city = faker.location.city()
   const country = faker.location.country()

   return new CityEntity(city, country)
})
