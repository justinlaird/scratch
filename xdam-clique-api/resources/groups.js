'use strict';

const jsonApi = require('jsonapi-server');
const dataStoreHandlerFactory = require('../rest-handlers/dataStoreHandler.js');
const authHandlerFactory = require('../rest-handlers/authHandler.js');
const timestampHandlerFactory = require('../rest-handlers/timestampHandler.js');

const dataStoreHandler = dataStoreHandlerFactory();
const authHandler = authHandlerFactory();
const timestampHandler = timestampHandlerFactory()

jsonApi.define({
  namespace: 'json:api',
  resource: 'groups',
  description: 'A user group within a customer organization',
  handlers: authHandler.chain(timestampHandler).chain(dataStoreHandler),
  store: dataStoreHandler,
  searchParams: {},
  attributes: {
    name: jsonApi.Joi.string().required()
      .description('The name of the Group')
      .example('Photo Retouch Group'),

    created: jsonApi.Joi.string().regex(/^\d{4}-0?\d+-0?\d+[T ]0?\d+:0?\d+:0?\d+Z$/)
      .description('The date on which the Group was created in ISO 8601 format, UTC')
      .example('2018-05-24T00:10:15Z')
      .optional()
      .allow(null),

    modified: jsonApi.Joi.string().regex(/^\d{4}-0?\d+-0?\d+[T ]0?\d+:0?\d+:0?\d+Z$/)
      .description('The date on which the Group was updated in ISO 8601 format, UTC')
      .example('2018-05-24T00:13:13Z')
      .optional()
      .allow(null),

    users: jsonApi.Joi.many('users')
      .description('All of the users belonging to this group'),

    collections: jsonApi.Joi.many('collections')
      .description('All of the collections shared through this group'),

    customer: jsonApi.Joi.belongsToOne({
        resource: 'customers',
        as: 'groups'
    })
  },
});
