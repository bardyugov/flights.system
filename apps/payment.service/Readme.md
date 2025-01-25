## Set NODE_ENV

```sh
export PORT=3002
export NODE_ENV=development
export NODE_ENV=production
```

## Apply migrations

```sh
npx nx run payment.service:migrations:apply
```

## Generating new migration

```sh
npx nx run payment.service:migration:generate --name={migrationName}
```

## Run seeds

```sh
npx nx run payment.service:seeds:apply
```

## Build service

```sh
npx nx run payment.service:build
```

## Run service

```sh
npx nx run payment.service:serve
```
