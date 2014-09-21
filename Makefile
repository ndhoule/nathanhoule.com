NODE=$(shell which node)
BOWER=./node_modules/.bin/bower

clean:
	rm -rf build/*

bower_components: bower.json
	@$(BOWER) install

build: bower_components
	@$(NODE) build

.DEFAULT_GOAL = build
.PHONY: build clean
