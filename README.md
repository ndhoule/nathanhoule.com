# `nathanhoule.com`

My (Nathan Houle) personal website.

## Requirements

- [Node.js](https://nodejs.org/en)
- [Yarn](https://yarnpkg.com/)

## Development

This project uses Yarn to manage dependencies.

To install dependencies:

```sh
$ yarn install
```

To develop:

```sh
$ yarn run dev
```

## Deployment

This site is publicly available at [www.nathanhoule.com](https://www.nathanhoule.com/).

It's deployed as a container image to my Nomad cluster; deployments are automatically performed by CI/CD ([Gitea Actions](./.gitea/)).

To deploy to Nomad manually, see `package.json#scripts.deploy` (or `yarn run deploy`); to build the image locally, see `package.json#scripts.build-docker`.
