'use strict';

const tokenAuth = require('../util/tokenAuth.js');
const jsonApi = require('jsonapi-server');

module.exports = function(){
  var authenticationHandler = new jsonApi.ChainHandler();

  authenticationHandler.beforeFind = authenticationHandler.beforeSearch =
  authenticationHandler.beforeDelete  = authorizeReadRequest;

  authenticationHandler.beforeCreate = authenticationHandler.beforeUpdate = authorizeWriteRequest;

  return authenticationHandler;
};

function authorizeWriteRequest(request, data, callback) {
  let authToken = null;
  if (request.headers && request.headers.authorization) {
    authToken = request.headers.authorization.replace('Bearer ', '');
  } else {
    return callback({
      status: '401'
    });
  }
  try {
    tokenAuth.validateToken(authToken);
  } catch(error){
    console.log("Error Authorizing request: " + error );
    return callback({
      status: '401'
    });
  }

  callback(null, request, data);
}

function authorizeReadRequest(request, callback) {
  let authToken = null;
  if (request.headers && request.headers.authorization) {
    authToken = request.headers.authorization.replace('Bearer ', '');
  } else {
    return callback({
      status: '401'
    });
  }
  try {
    tokenAuth.validateToken(authToken);
  } catch(error){
    console.log("Error Authorizing request: " + error );
    return callback({
      status: '401'
    });
  }
  callback(null, request);
}
