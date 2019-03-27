'use strict';

const jsonApi = require('jsonapi-server');
const moment = require('moment');

module.exports = function(){
  var timestampHandler = new jsonApi.ChainHandler();

  timestampHandler.beforeCreate =  function (request, data, callback) {
    let requestTimeUTC = moment.utc().format();
    data.created = requestTimeUTC;
    data.modified = requestTimeUTC;
    callback(null, request, data);
  }

  timestampHandler.beforeUpdate = function (request, data, callback) {
    let requestTimeUTC = moment.utc().format();
    data.modified = requestTimeUTC;
    callback(null, request, data);
  }

  return timestampHandler;
};
