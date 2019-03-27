'use strict';

const jsonApi = require('jsonapi-server');
const notificationManager = require('../services/notification-manager');

const notifcationHandler = module.exports = new jsonApi.ChainHandler();

notifcationHandler.afterCreate =  function (request, response, callback) {
  console.log(`Emitting event ${notificationManager.CREATE_ASSET}`);
  if (response && response.folder) {
    notificationManager.publish(response.folder.id, notificationManager.CREATE_ASSET);
  }
  callback(null,  response);
}

notifcationHandler.afterUpdate =  function (request, response, callback) {
  console.log(`Emitting event ${notificationManager.UPDATE_ASSET}`);
  if (response && response.folder) {
   notificationManager.publish(response.folder.id, notificationManager.UPDATE_ASSET);
  }
  callback(null,  response);
}
