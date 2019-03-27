'use strict';

const jsonApi = require('jsonapi-server');
const dataStoreHandlerFactory = require('../rest-handlers/dataStoreHandler.js');
const authHandlerFactory = require('../rest-handlers/authHandler.js');
const timestampHandlerFactory = require('../rest-handlers/timestampHandler.js');

const dataStoreHandler = dataStoreHandlerFactory();
const authHandler = authHandlerFactory();
const timestampHandler = timestampHandlerFactory();

jsonApi.define({
  namespace: 'json:api',
  resource: 'users',
  generatedId: false,
  description: 'Users within a division',
  handlers: authHandler.chain(timestampHandler).chain(dataStoreHandler),
  store: dataStoreHandler,
  searchParams: { },
  attributes: {
    firstname: jsonApi.Joi.string().alphanum()
      .description('The users first name')
      .example('John'),

    lastname: jsonApi.Joi.string().alphanum()
      .description('The users last name')
      .example('Smith'),

    email: jsonApi.Joi.string().email()
      .description('The users preferred contact email address')
      .example('john.smith@gmail.com'),

    //Login credentials will ultimately not be stored in the database, these are only here for development purposes
    login: jsonApi.Joi.string().alphanum()
      .description('The users login ID')
      .example('jsmoove'),

    //Login credentials will ultimately not be stored in the database, these are only here for development purposes
    password: jsonApi.Joi.string().alphanum()
      .description('The users preferred contact email address')
      .example('SooperSecret'),

    created: jsonApi.Joi.string().regex(/^\d{4}-0?\d+-0?\d+[T ]0?\d+:0?\d+:0?\d+Z$/)
      .description('The date on which the User was created in ISO 8601 format, UTC')
      .example('2018-05-24T00:10:15Z')
      .optional()
      .allow(null),

    modified: jsonApi.Joi.string().regex(/^\d{4}-0?\d+-0?\d+[T ]0?\d+:0?\d+:0?\d+Z$/)
      .description('The date on which the User was updated in ISO 8601 format, UTC')
      .example('2018-05-24T00:13:13Z')
      .optional()
      .allow(null),

    collections: jsonApi.Joi.many('collections')
      .description('Personal collections for this user'),


    projects: jsonApi.Joi.many('projects')
      .description('Projects belonging to this User'),

    customer: jsonApi.Joi.belongsToOne({
        resource: 'customers',
        as: 'users'
    }),

    groups: jsonApi.Joi.belongsToMany({
        resource: 'groups',
        as: 'users'
    }),
  },
});
