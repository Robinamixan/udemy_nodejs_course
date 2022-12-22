#!/bin/bash

GET_DOCKER_ID_COMMAND=$(shell docker ps -aqf "name=nodejs_course_web")

.PHONY: start
start:
	@docker-compose -f docker-compose.yml up -d

.PHONY: stop
stop:
	@docker-compose -f docker-compose.yml stop

.PHONY: rebuild-and-start
rebuild-and-start:
	@docker-compose -f docker-compose.yml up --build --force-recreate -d

.PHONY: bash
bash:
	$(eval DOCKER_ID=$(GET_DOCKER_ID_COMMAND))
	@docker exec -it $(DOCKER_ID) bash

