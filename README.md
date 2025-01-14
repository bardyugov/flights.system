# Create docker network

```sh
docker network create shared-network         
```

## Run communication microserivces cluster

```sh
cd docker/kafka-cluster
docker-compose up --build -d
```

## Run elk cluster

```sh
cd docker/elk-cluster
docker-compose up --build -d
```

## Run flights.creator.service

 ```sh
cd docker/flights-creator-cluster
docker-compose up --build -d
```

## Run gateway

```sh
cd docker/gateway-cluster
docker-compose up --build -d
```

## Gateway

```sh
http://localhost:5001/api
```

## Kafka-UI uri

 ```sh
http://localhost:8080
```

## Kibana uri

 ```sh
http://0.0.0.0:5601
```

## Elastic-search uri

```sh
http://locahost:9200
```

