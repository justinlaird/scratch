# Clique API Server

* Install [Yarn](https://yarnpkg.com/lang/en/docs/install)

* From xdam-clique-api directory, run "yarn install"

* Then run "yarn start"

* Alternately, you can run the server by typing "node server.js"

## Docker

* Build the docker image: docker build -t xdam-clique-api .
* Run the docker image: docker run -p 16006:16006 xdam-clique-api
* Stop the docker image: docker stop `<container-id>`
  * Use "docker container ls" to find the container-id

## Scripts

* `yarn start`
  * Starts the server in development.
* `yarn run start:auto`
  * Start the server using nodemon, which will restart the server on file change.
* `yarn run start:auto:inspect`
  * Start the server using nodemon, which will restart the server on file change,
    using nodemon to keep a debugging session connected to chrome dev tools between
    restarts.
* `yarn run test`
  * Runs the tests with a test seed using standard Qunit test runner and settings.
* `yarn run test:auto`
  * Runs the tests using nodemon which will restart the tests on file change.
  * TODO: keeping a --inspect window open for both the server and the tests
    is needed in the future, but passing a port to nodemon --inspect was not
    working at time of this writing.
* `yarn run lint:js`
  * Run eslint across all files
* `yarn run lint:js:fix`
  * Run and fix eslint errors across all files

While this list does its best to remain up to date, at any point in the project
lifecycle, use `yarn run` to get a full output.

