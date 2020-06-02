# Golf League Svelte App

### Deployment Status
## Travis CI
[![Build Status](https://travis-ci.org/mhartman4/cle.golf.svg?branch=master)](https://travis-ci.org/mhartman4/cle.golf)

The deployment model here is Github -> Travis CI -> S3 static web site.


### Dev

## Get started

Install the dependencies...

```bash
cd golf-league-svelte-app
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.

## Building the app

To create an optimised version of the app:

```bash
npm run build
```