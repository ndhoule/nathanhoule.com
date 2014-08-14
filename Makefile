build: node_modules bower_components
	@node build

node_modules: package.json
	@npm install

bower_components: bower.json
	@bower install

clean:
	rm -rf build/*

.PHONY: build clean
