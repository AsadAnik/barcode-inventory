# Define common variables
COMPOSE_FILE = docker-compose.yml

# Targets
.PHONY: api db all clean

# Start only the API container
api:
	docker-compose -f $(COMPOSE_FILE) up --build -d server-api

api-dev:
	docker-compose -f $(COMPOSE_FILE) up --build server-api

# Start Web Client container
web:
	docker-compose -f $(COMPOSE_FILE) up --build -d client-web

web-dev:
	docker-compose -f $(COMPOSE_FILE) up --build client-web

# Start only the MongoDB container
db:
	docker-compose -f $(COMPOSE_FILE) up --build -d mongodb

db-dev:
	docker-compose -f $(COMPOSE_FILE) up --build mongodb

# Start both API and MongoDB (full setup)
all:
	docker-compose -f $(COMPOSE_FILE) up --build -d

all-dev:
	docker-compose -f $(COMPOSE_FILE) up --build

# Stop and remove all containers
down:
	docker-compose -f $(COMPOSE_FILE) down
