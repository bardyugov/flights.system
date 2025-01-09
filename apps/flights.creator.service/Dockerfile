FROM node:22.9-alpine AS builder

WORKDIR build

COPY package*.json ./
RUN npm install
COPY . .

ENV NODE_ENV production

RUN npx nx build flights.creator.service
RUN npx nx run flights.creator.service:migration:apply
RUN npx nx run flights.creator.service:seeds:run

FROM builder AS core

WORKDIR app

COPY --from=builder build/dist/apps/flights.accumulator ./

RUN npm install

ENV NODE_ENV production

CMD ["node", "main.js"]
