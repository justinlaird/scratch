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
  resource: 'collections',
  description: 'A collection belonging to a user or project folder',
  handlers: authHandler.chain(timestampHandler).chain(dataStoreHandler),
  store: dataStoreHandler,
  searchParams: {},
  attributes: {
    name: jsonApi.Joi.string().required()
      .description('The name of the Project')
      .example('Bits of String'),

    created: jsonApi.Joi.string().regex(/^\d{4}-0?\d+-0?\d+[T ]0?\d+:0?\d+:0?\d+Z$/)
      .description('The date on which the Collection was created in ISO 8601 format, UTC')
      .example('2018-05-24T00:10:15Z')
      .optional()
      .allow(null),

    modified: jsonApi.Joi.string().regex(/^\d{4}-0?\d+-0?\d+[T ]0?\d+:0?\d+:0?\d+Z$/)
      .description('The date on which the Collection was updated in ISO 8601 format, UTC')
      .example('2018-05-24T00:13:13Z')
      .optional()
      .allow(null),

    assets: jsonApi.Joi.many('assets')
      .description('All of the assets under a folder'),


    folder: jsonApi.Joi.belongsToOne({
        resource: 'folders',
        as: 'collections'
    })
    .optional()
    .description('The parent folder for Project Collections'),

    user: jsonApi.Joi.belongsToOne({
        resource: 'users',
        as: 'collections'
    })
    .optional()
    .description('The parent user for Personal Collections'),

    groups: jsonApi.Joi.belongsToMany({
        resource: 'groups',
        as: 'users'
    }),

  },
});
