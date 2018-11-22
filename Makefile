all: build
build: compile

compile:
	npm run -s compile

install:
	npm install -g .
