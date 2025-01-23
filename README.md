# Create docker network

```sh
docker network create shared-network         
```

## Run kafka-cluster

```sh
cd docker/kafka-cluster
docker-compose up --build -d
```

## Run elk-cluster

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

## Run payment.service

```sh
cd docker/payment-cluster
docker-compose up --build -d
```

## Run employees.service
```sh
cd docker/employees-cluster
docker-compose up --build -d
```

## Gateway

```sh
http://localhost:5001/api
```

## Kafka UI URL

 ```sh
http://localhost:8080
```

## Kibana URL

 ```sh
http://0.0.0.0:5601
```

## ElasticSearch URL

```sh
http://localhost:9200
```

