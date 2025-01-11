FROM node:22.9-alpine AS app

WORKDIR app

COPY package*.json ./
COPY ./apps/gateway/runner.sh ./

RUN npm install

COPY . .
RUN npx nx run gateway:build

ENV NODE_ENV production
ENV PORT 5001

EXPOSE 5001

RUN chmod +x runner.sh

CMD ./runner.sh
