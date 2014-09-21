clean:
	rm -rf build/*

bower_components: bower.json
	@bower install

build: bower_components
	@node build

.DEFAULT_GOAL = build
.PHONY: build clean
