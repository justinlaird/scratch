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
  resource: 'folders',
  description: 'An folder folder within a project',
  handlers: authHandler.chain(timestampHandler).chain(dataStoreHandler),
  store: dataStoreHandler,
  searchParams: {},
  attributes: {
    name: jsonApi.Joi.string().required()
      .description('The name of the Project')
      .example('Alphabetize Shoe Rack'),

    created: jsonApi.Joi.string().regex(/^\d{4}-0?\d+-0?\d+[T ]0?\d+:0?\d+:0?\d+Z$/)
      .description('The date on which the Folder was created in ISO 8601 format, UTC')
      .example('2018-05-24T00:10:15Z')
      .optional()
      .allow(null),

    modified: jsonApi.Joi.string().regex(/^\d{4}-0?\d+-0?\d+[T ]0?\d+:0?\d+:0?\d+Z$/)
      .description('The date on which the Folder was updated in ISO 8601 format, UTC')
      .example('2018-05-24T00:13:13Z')
      .optional()
      .allow(null),

    assets: jsonApi.Joi.many('assets')
    .description('All of the assets under a folder'),

    folders: jsonApi.Joi.many('folders')
    .description('Folders that are direct children of this folder'),

    collections: jsonApi.Joi.many('collections')
    .description('Collections that are direct children of this folder'),

    folder: jsonApi.Joi.belongsToOne({
        resource: 'folders',
        as: 'folders'
    })
    .description('The parent folder of this folder'),

    project: jsonApi.Joi.belongsToOne({
        resource: 'projects',
        as: 'rootFolder'
    })
    .description('The parent project of this folder'),
  },
});
