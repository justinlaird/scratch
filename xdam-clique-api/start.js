'use strict';

require('dotenv').config();
require('./monit')();
const Server = require('./index');
const Hecks = require('hecks');
const app = require('./jsonapi-server');
const config  = require('config');

const internals = {};

const { CACHE_STORE } = process.env;

let cache;
if (CACHE_STORE === 'redis') {
  cache = {
    engine: require('catbox-redis'),
  }
}

internals.manifest = {
  server: {
    cache,
    address: config.get('server.address'),
    host: config.get('server.address'),
    port: config.get('server.internalPort'),
    router: {
      stripTrailingSlash: true,
      isCaseSensitive: false,
    },
    routes: {
      cors: {
        origin: 'ignore'
      }
    }
  },
  register: {
    plugins: [
      {
        plugin: Hecks.toPlugin(app, 'express'),
        options: {}
      },
      {
        plugin: require('@gar/hapi-json-api'),
        options: {}
      },
      {
        plugin: require('susie'),
        options: {}
      },
      {
        plugin: require('good'),
        options: {
          reporters: {
            myConsoleReporter: [
              {
              module: 'good-squeeze',
              name: 'Squeeze',
              args: [{ log: '*', response: '*' }]
            },
            {
              module: 'good-console'
            }, 'stdout']
          }
        },
      },
      {
        plugin: './src/api/authorization',
        options: {
          disable: true
        }
      },
      {
        plugin: './src/api/file-upload',
        options: {}
      },
      {
        plugin: './src/api/health-check',
        options: {}
      },
      {
        plugin: './src/api/events',
        options: {}
      },
    ],
  }
};

internals.composeOptions = {
  relativeTo: process.cwd(),
};

if (module.parent) {
  throw Error('start.js is never meant to be required from another module. Refactor');
}

(async () => {
  const server = await Server.init(internals.manifest, internals.composeOptions);
  await server.start();
  server.log('Server started at: ' + server.info.uri);
})();
