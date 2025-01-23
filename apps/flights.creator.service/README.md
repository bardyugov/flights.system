## Set NODE_ENV

```sh
export PORT=3000
export NODE_ENV=development
export NODE_ENV=production
```

## Apply migrations

```sh
npx nx run flights.creator.service:migrations:apply
```

## Generating new migration

```sh
npx nx run flights.creator.service:migration:generate --name={migrationName}
```

## Run seeds

```sh
npx nx run flights.creator.service:seeds:apply
```

## Build service

```sh
npx nx run flights.creator.service:build
```

## Run service

```sh
npx nx run flights.creator.service:serve
```
