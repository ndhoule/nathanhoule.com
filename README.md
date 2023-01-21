# `nathanhoule.com`

Nathan Houle's personal website.

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

To build the project for deployment:

```sh
$ yarn run distclean && yarn run build && yarn run export
```

On success, the built files will be output to `dist/`.
