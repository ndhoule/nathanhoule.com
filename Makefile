ESLINT := yarn run eslint
GATSBY := yarn run gatsby
GRAPHQL_CODEGEN := yarn run graphql-codegen
STYLELINT := yarn run stylelint
TSC := yarn run tsc

ESLINT_FLAGS ?= --cache
GRAPHQL_CODEGEN_FLAGS ?= --config codegen.yml
STYLELINT_FLAGS ?= --cache

CONFIG = $(wildcard .*rc .*rc.js *.config.js)
SRC = $(shell find src \
	-not \( -path src/generated -prune \) \
	   -iname "*.css" \
	-o -iname "*.js" \
	-o -iname "*.jsx" \
	-o -iname "*.ts" \
	-o -iname "*.tsx")

#
# Tasks
#

# Remove built files.
clean:
	rm -rf public/*
.PHONY: clean

# Reset the project to a clean state.
distclean: clean
	rm -rf .cache .eslintcache
	yarn cache clean
.PHONY: clean

# Install node modules.
.yarn/cache: package.json yarn.lock
	yarn install
	@touch .yarn/cache

install: .yarn/cache
.PHONY: install

#
# Build
#

build-typedefs:
	$(GRAPHQL_CODEGEN) $(GRAPHQL_CODEGEN_FLAGS)
.PHONY: build-typedefs

build-typedefs-watch: GRAPHQL_CODEGEN_FLAGS += --watch
build-typedefs-watch: build-typedefs
.PHONY: build-typedefs-watch

# Build the site into the public/ directory.
build:
	$(GATSBY) build
.PHONY: build
.DEFAULT_GOAL = build

#
# Development
#

# Build and serve the site in watch mode.
dev:
	$(GATSBY) develop
.PHONY: dev

# Serve the built site from the public/ directory.
serve:
	$(GATSBY) serve
.PHONY: serve

#
# Testing
#

lint-es: $(filter %.js %.jsx %.ts %.tsx,$(SRC)) $(CONFIG)
	$(ESLINT) $(ESLINT_FLAGS) $^
.PHONY: lint-es

fix-es: ESLINT_FLAGS += --fix
fix-es: lint-es
.PHONY: fix-es

lint-style: $(filter $.css %.jsx %.tsx,$(SRC))
	$(STYLELINT) $(STYLELINT_FLAGS) $^
.PHONY: lint-style

fix-style: STYLELINT_FLAGS += --fix
fix-style: lint-style
.PHONY: fix-style

lint: lint-es lint-style
.PHONY: lint

fix: fix-es fix-style
.PHONY: fix

typecheck:
	$(TSC)
.PHONY: typecheck

test-unit:
	@echo "ERROR: No tests"
	@exit 1
.PHONY: test-unit

test: lint-es lint-style typecheck test-unit
.PHONY: test
