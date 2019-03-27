'use strict';

const Boom = require('boom');
const Joi = require('joi');
const Client = require('../client');

module.exports = {
  version: process.env.npm_package_version,
  name: 'file-upload',
  register: function (server/* , options */) {
    server.route({
      method: ['GET'],
      path: '/_ops/upload/{parentResourceType}/{parentId}/{resourceType}/{id?}',
      handler: async function (request, h) {
        try {
          const client = new Client(request);
          const data = await client.getSignedUrl();
          return h.response({ signedRequest: data }).code(200);
        } catch(err) {
          throw Boom.badRequest(err);
        }
      },
      options: {
        log: { collect: true },
        security: {
          xframe: true,
          xss: true,
          noOpen: true,
          noSniff: true,
          referrer: 'origin-when-cross-origin', // TODO: PRODUCTION CHECK
        },
        validate: {
          params: {
            parentResourceType: Joi.string().allow(['folders']).required(),
            parentId: Joi.string().required(),
            // parentId: Joi.string().guid({ version: ['uuidv4', 'uuidv5'] }).required(),
            resourceType: Joi.string().allow(['assets']).default('assets').required(),
            // id: Joi.string().guid({ version: ['uuidv4'] }).optional(),
            id: Joi.string().optional(),
          },
          query: {
            fileName: Joi.string().required(),
          },
        }
      },
    });
  }
};
