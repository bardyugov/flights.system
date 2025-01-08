## Run database server
```sh
cd docker/flights.creator.service-cluster
docker-compose up --build -d
```

## Run transport cluster
```sh
cd docker/kafka-cluster
docker-compose up --build -d
```

## Set NODE_ENV
```sh
export NODE_ENV=development || production
```

## Apply migrations
```sh
npx nx run flights.creator.service:migration:apply
```

## Generating new migration
```sh
npx nx run flights.creator.service:migration:generate --name={migrationName}
```

## Run seeds 
```sh
npx nx run flights.creator.service:seeds:run
```

## Build service
```sh
npx nx run flights.creator.service:build
```

## Run service
```sh
npx nx run flights.creator.service:serve
```
