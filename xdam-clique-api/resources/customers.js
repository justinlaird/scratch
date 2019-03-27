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
  resource: 'customers',
  description: 'A customer organization',
  handlers: authHandler.chain(timestampHandler).chain(dataStoreHandler),
  store: dataStoreHandler,
  searchParams: {},
  attributes: {
    name: jsonApi.Joi.string().required()
      .description('The name of the Customer')
      .example('Very Important Work Stuff'),

    created: jsonApi.Joi.string().regex(/^\d{4}-0?\d+-0?\d+[T ]0?\d+:0?\d+:0?\d+Z$/)
      .description('The date on which the Customer was created in ISO 8601 format, UTC')
      .example('2018-05-24T00:10:15Z')
      .optional()
      .allow(null),

    modified: jsonApi.Joi.string().regex(/^\d{4}-0?\d+-0?\d+[T ]0?\d+:0?\d+:0?\d+Z$/)
      .description('The date on which the Customer was updated in ISO 8601 format, UTC')
      .example('2018-05-24T00:13:13Z')
      .optional()
      .allow(null),

    users: jsonApi.Joi.many('users')
      .description('All of the people associated with a Customer'),

    groups: jsonApi.Joi.many('groups')
    .description('All of the groups associated with a Customer'),

    projects: jsonApi.Joi.many('projects')
    .description('Projects belonging to this Organization'),

  },
});
