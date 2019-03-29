const config  = require('config');
const jsonApi = require('jsonapi-server');
const fs = require('fs');
const path = require('path');

const _ = {
  mapValues: require('lodash/mapValues'),
  invokeMap: require('lodash/invokeMap'),
  isPlainObject: require('lodash.isplainobject')
};

const JsonApiService = {};

JsonApiService.initialize = function(router, createDb = false) {
  console.log("!!! CALLED JsonApiService.initialize !!!");

  jsonApi.setConfig({
    router: router,
    graphiql: true,
    swagger: {
      title: 'Clique JSON:API Server',
      version: '0.0.1',
      description: 'Clique API',
      termsOfService: '',
      contact: {
        name: 'API Contact',
        email: 'support@xdam.com',
        url: 'xdam.com'
      },
      security: [
        {
           Bearer: []
        }
      ],
      license: {
        name: 'XDAM, Inc',
      },
      securityDefinitions: {
        Bearer: {
           description: 'For accessing the API a valid token must be passed in all the queries. The following syntax must be used in the "Authorization" header: Bearer xxxxxx.yyyyyyy.zzzzzz',
           type: 'apiKey',
           name: 'Authorization',
           in: 'header'
        }
     }
    },
    protocol: 'http',
    hostname: config.get('server.hostname'),
    //port: config.get('server.port'),
    base: 'rest',
    meta: {
      description: 'API for Clique'
    }
  });

  fs.readdirSync(path.join(__dirname, '../resources')).filter(filename => /^[a-z].*\.js$/.test(filename)).map(filename => path.join(__dirname, '../resources/', filename)).forEach(require)


  jsonApi.onUncaughtException((request, error) => {
    const errorDetails = error.stack.split('\n')
    console.error(JSON.stringify({
      request,
      error: errorDetails.shift(),
      stack: errorDetails
    }, undefined, 2))
  });

  console.log("Before jsonapi start");
  jsonApi.start();
  console.log("After jsonapi start");

  this._resourceDataStores = _.mapValues(jsonApi._resources, 'store');
  _.invokeMap(this._resourceDataStores, 'defineRelationModels', this._resourceDataStores, createDb);
};

JsonApiService.resourceDataStores = function() {
  if (!_.isPlainObject(this._resourceDataStores)) {
    this._resourceDataStores = {};
  }
  return this._resourceDataStores;
};

console.log("Before module export ");
module.exports = JsonApiService;

/*
TODO: convert to ES6 class
module.exports = class JsonApi {

    static getInstance() {
      return new this(...arguments);

    }

    constructor() {
      super(...arguments);
      this.initialize();
    }

    initialize(){

    }

}
*/
