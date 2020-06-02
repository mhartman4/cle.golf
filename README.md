# Golf League Svelte App

## Travis CI
[![Build Status](https://travis-ci.org/mhartman4/cle.golf.svg?branch=master)](https://travis-ci.org/mhartman4/cle.golf)

## Developing

Install the dependencies...

```bash
cd cle.golf
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Go to [localhost:5000](http://localhost:5000). You should see the app running.

## Deploying

The deployment model here is Github -> Travis CI -> S3 static web site. When you make any changes while developing, the relevant JS and CSS files are be updated automatically so no need to do anything else...just push those changes to the Github repo and it will kick off Travis CI to make changes to the S3 bucket.

Note: The only difference between `dev` and `prod` is which HTML file is served. In dev, we use `public/index.html` but in prod we use `index.html`. This is dumb and only because of the way S3 static sites work. These two files should be identical other than adding "public/" to the prod paths. They should rarely need to be changed anyways.
