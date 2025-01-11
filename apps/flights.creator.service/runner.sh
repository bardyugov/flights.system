npx nx run flights.creator.service:migrations:apply
npx nx run flights.creator.service:seeds:run

node ./dist/apps/flights.creator.service/main.js
