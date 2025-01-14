FROM node:22.9-alpine AS app

WORKDIR app

COPY package*.json ./

COPY ./apps/flights.creator.service/runner.sh ./

RUN npm install

COPY . .
RUN npx nx run flights.creator.service:build

ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000

RUN chmod +x runner.sh

CMD ./runner.sh
