SHELL := /bin/bash
.PHONY: npm_version sencha_build docker_build docker_push sloppy_change create_tag

# Varables
version := 0.0.0
dockerhub-repository := user/repository-name
domain := domain.tdl

help:
	@echo "make build -- sencha app build testing and production"
	@echo "make all -- Example: make all version=1.2.3 domain=domain.tdl dockerhub-repository=user/repository-name"

npm_version:
	npm --no-git-tag-version version $(version)

sencha_build:
	@echo "make build -- sencha app build production"
	cd client; sencha-6.5.0.180 app build production

docker_build:
	@echo "make docker_build"
	docker build -t $(dockerhub-repository):$(version) .

docker_push:
	@echo "make docker_push"	
	docker push $(dockerhub-repository):$(version)

sloppy_change:
	@echo "make sloppy_change"
	sloppy change -var=domain:$(domain) -var=version:$(version) -var dockerhub-repository:$(dockerhub-repository) sloppy-io-deploy-config.json

create_tag:
	git checkout client/app.json
	git checkout client/index.html
	git add -A
	git commit -m "v$(version)"
	git tag v$(version)
	git push
	git push origin v$(version)

all: npm_version sencha_build create_tag docker_build docker_push sloppy_change
