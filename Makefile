DOCKER_FILE=docker-compose.dev.yml
DB_USER=admin
DB_NAME=cycling
DOCKER_DB_NAME=cycling_db_dev

DB_BACKUP_DATE=$(shell date +'%Y-%m-%dT%Hh%M')
DB_BACKUP_NAME=cycling-db-backup-data

.ONESHELL:
.PHONY: docker-% frontend-% backend-% db-% dev help

help: # Show help for each of the Makefile recipes
	@grep -E '^[a-zA-Z0-9 -]+:.*#'  Makefile | sort | while read -r l; do printf "\033[1;32m$$(echo $$l | cut -f 1 -d':')\033[00m:$$(echo $$l | cut -f 2- -d'#')\n"; done



docker-dev: # run the dev docker db
	docker compose -f $(DOCKER_FILE) up -d

docker-down: # stop the docker db
	docker compose -f $(DOCKER_FILE) down



db-inspect: # run psql for the db docker
	docker exec -it $(DOCKER_DB_NAME) psql --user $(DB_USER) $(DB_NAME)

db-backup: # create a db backup
	docker exec -t $(DOCKER_DB_NAME) pg_dump \
	  -U $(DB_USER) \
	  --data-only \
	  --exclude-table-data=public.goose* \
	  $(DB_NAME) > $(DB_BACKUP_DATE)-$(DB_BACKUP_NAME).sql

db-apply: # apply a db file to the database, usage: make db-file FILE=backup.sql
ifndef FILE
	$(error FILE is not set, ex: 'make docker-db-restore FILE=./backup.sql')
endif
	docker exec -i $(DOCKER_DB_NAME) psql \
	  -U $(DB_USER) \
	  -d $(DB_NAME) \
	  < $(FILE)

db-trucate: # truncate the database table with the ./script/truncate.sql file
	@echo -n "This will alter the db, are you sure? [y/n] " && read ans && [ $${ans:-y} != y ] && echo "Aborted" && exit 1
	docker exec -i $(DOCKER_DB_NAME) psql \
	  -U $(DB_USER) \
	  -d $(DB_NAME) \
	  < ./script/truncate.sql

db-restore: db-trucate db-apply # truncate the db and apply the given sql file. Usage: 'make db-restore FILE=backup.sql'


frontend-dev: # run the frontend dev
	cd frontend && npm run dev

backend-dev: # run the backend dev
	cd backend && air

dev: # run the front, back and db dev env
	trap 'docker compose -f $(DOCKER_FILE) down' INT TERM EXIT
	$(MAKE) docker-dev
	$(MAKE) -j2 frontend-dev backend-dev
