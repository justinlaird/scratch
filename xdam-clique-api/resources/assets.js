'use strict';

const jsonApi = require('jsonapi-server');
const dataStoreHandlerFactory = require('../rest-handlers/dataStoreHandler.js');
const authHandlerFactory = require('../rest-handlers/authHandler.js');
const timestampHandlerFactory = require('../rest-handlers/timestampHandler.js');
const notificationHandler =  require('../rest-handlers/notificationHandler.js');

const dataStoreHandler = dataStoreHandlerFactory();
const authHandler = authHandlerFactory();
const timestampHandler = timestampHandlerFactory();

jsonApi.define({
  namespace: 'json:api',
  resource: 'assets',
  description: 'An asset is a file with one and only one parent folder and location',
  handlers: authHandler.chain(timestampHandler).chain(notificationHandler).chain(dataStoreHandler),
  store: dataStoreHandler,
  searchParams: {},
  attributes: {
    name: jsonApi.Joi.string().required()
      .description('The name of the Asset')
      .example('meme.gif'),

    location: jsonApi.Joi.string().optional().allow(null)
      .description('The location of the Asset')
      .example('s3.amazon.com/my-s3-bucket'),

    fileType: jsonApi.Joi.string().required()
      .description('The mime type of the Asset')
      .example('image/jpeg'),

    success: jsonApi.Joi.boolean().default(false),

    created: jsonApi.Joi.string().regex(/^\d{4}-0?\d+-0?\d+[T ]0?\d+:0?\d+:0?\d+Z$/)
      .description('The date on which the Asset was created in ISO 8601 format, UTC')
      .example('2018-05-24T00:10:15Z')
      .optional()
      .allow(null),

    modified: jsonApi.Joi.string().regex(/^\d{4}-0?\d+-0?\d+[T ]0?\d+:0?\d+:0?\d+Z$/)
      .description('The date on which the Asset was updated in ISO 8601 format, UTC')
      .example('2018-05-24T00:13:13Z')
      .optional()
      .allow(null),

    collections: jsonApi.Joi.belongsToMany({
        resource: 'collections',
        as: 'assets'
    })
    .optional()
    .description('Collections that this asset is included in'),

    folder: jsonApi.Joi.belongsToOne({
        resource: 'folders',
        as: 'assets'
    })
    .description('The folder that this asset is located in'),
  }
});
