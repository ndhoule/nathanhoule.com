# `nathanhoule.com`

My (Nathan Houle's) personal website.

## Requirements

- [Node.js](https://nodejs.org/en) 24.22.0 or later
- [pnpm](https://pnpm.io/)

## Development

To install dependencies:

```sh
pnpm install
```

To develop:

```sh
pnpm run dev
```

## Deployment

This site is publicly available at [www.nathanhoule.com](https://www.nathanhoule.com/).

It's deployed as a container image to my Nomad cluster; deployments are performed by CI/CD ([Forgejo Actions](./.forgejo/)).

To deploy to Nomad manually, run `pnpm run deploy`. To build the image locally, run `pnpm run build-docker`.
