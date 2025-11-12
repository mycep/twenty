# Makefile for building Twenty CRM docker images.
# Set the tag and/or target build platform using make command-line variables assignments.
#
# Optional make variables:
# PLATFORM - defaults to 'linux/amd64'
# TAG      - defaults to 'latest'
# IMAGE    - defaults to 'twenty'
#
# Example: make
# Example: make PLATFORM=linux/aarch64 TAG=my-tag
# Example: make IMAGE=arefen/tamasin TAG=v0.10.1

PLATFORM ?= linux/amd64
TAG ?= latest
IMAGE ?= twenty

prod-build:
	@cd ../.. && docker build -f ./packages/twenty-docker/twenty/Dockerfile --platform $(PLATFORM) --tag $(IMAGE):$(TAG) . && cd -

prod-run:
	@docker run -d -p 3000:3000 --name twenty $(IMAGE):$(TAG)

prod-postgres-run:
	@docker run -d -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres --name twenty-postgres twenty-postgres:$(TAG)

prod-website-build:
	@cd ../.. && docker build -f ./packages/twenty-docker/twenty-website/Dockerfile --platform $(PLATFORM) --tag twenty-website:$(TAG) . && cd -

prod-website-run:
	@docker run -d -p 3000:3000 --name twenty-website twenty-website:$(TAG)
