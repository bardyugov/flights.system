## Run communication and montiring cluster
```sh
cd docker/kafka-cluster
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

## Kafka-UI 
 ```sh
http://localhost:8080
```

## Kibana
 ```sh
http://0.0.0.0:5601
```
