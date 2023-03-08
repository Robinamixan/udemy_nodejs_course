#!/bin/bash

.PHONY: start
start:
	@docker-compose -f docker-compose.yml up -d
	@docker exec -it nodejs_course_web npm start

.PHONY: stop
stop:
	@docker-compose -f docker-compose.yml stop

.PHONY: rebuild-and-start
rebuild-and-start:
	@docker-compose -f docker-compose.yml up --build --force-recreate -d

.PHONY: bash
bash:
	$(eval DOCKER_ID=$(GET_DOCKER_ID_COMMAND))
	@docker exec -it nodejs_course_web bash

