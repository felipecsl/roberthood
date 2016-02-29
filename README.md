# Cycle.js Browserify Boilerplate

While this boilerplate is heavily inspired by [cycle-webpack-boilerplate](https://github.com/Cmdv/cycle-webpack-boilerplate)
it is currently a simpler setup. So far it is not implementing hot module reloading.

The main dependencies for this boilerplate are:

- Browserify for bundling the JavaScript
- Watchify for watching JavaScript
- node-sass for Scss
- chokidar-cli for watching Sass files
- tape and testem for testing
- Eslint with the Cycle.js plugin for linting
- live-server as a dev server with livereload
- rimraf for cleaning the project

## Usage

First clone this repo and install the dependencies.

```shell
git clone https://github.com/kahlil/cycle-browserify-boilerplate.git && npm install
```

Then change the project name, repository link and description in your package.json and change
the remote URL for your Git repo.

```shell
git remote set-url origin master [YOUR GIT URL HERE]
```

## `npm scripts` Documentation

These are all the npm scripts tasks that come with this boilerplate.

The npm commands in **bold** letters are the ones you might use the most.

| npm Command | Description |
| ----------- | ----------- |
| `npm run clean` | Deletes the build folder. |
| `npm run budo` | Starts a development server, compiles and watches JavaScript and watches other assets. |
| `npm run build:js:prod` | Builds JavaScript for production with browserify and Uglify, generates external source maps. |
| `npm run build:css` | Compiles the Sass files to CSS. |
| `npm run build:css:prod` | Compiles the Sass files to CSS for production. |
| `npm run watch:scss` | Build and watch the Sass files with node-sass and chokidar. |
| `npm run lint` | Lint your files Cycle.js-style. |
| `npm test` | Run browser tests in testem. |
| `npm start` | Build everything, start all watch tasks and serve the index.html file. |
