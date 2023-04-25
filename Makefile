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
	@docker exec -it nodejs_course_web bash

.PHONY: test
test:
	@docker exec -it nodejs_course_web npm test
