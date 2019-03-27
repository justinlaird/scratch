'use strict'

const config = require('config');
const request = require('supertest');
const Promise = require('bluebird');
const Server = require('../../index');
const Hecks = require('hecks');
const app = require('../../jsonapi-server');

const helpers = module.exports = { };

const internals = {};

helpers.dateISORegex = /^\d{4}-0?\d+-0?\d+[T ]0?\d+:0?\d+:0?\d+Z$/;
helpers.testUrl = `${config.get('server.protocol')}://${config.get('server.hostname')}:${config.get('server.port')}`;
helpers.testLoginUsername = 'clique';
helpers.testLoginPassword = 'test';

helpers.testUserId = 'us5cca2e-0dd8-4b95-8cfc-a11230e73116';
helpers.testCustomerId = 'cu50ea75-4427-4f81-8595-039990aeede5';
helpers.testProjectId = 'pr41a4de-4986-4597-81b9-cf31b6762486';
helpers.testGroupId = '97170410-9c1c-46c5-9953-0ff89620e4e3';
helpers.testAssetId = 'as010000-0000-0000-0000-000000000000';
helpers.testCollectionId = 'co010000-0000-0000-0000-000000000000';
helpers.testIncludedCollectonId = 'co030000-0000-0000-0000-000000000000';
helpers.testFolderId = 'fo010000-0000-0000-0000-000000000000';
helpers.testParentFolderId = 'fo120000-0000-0000-0000-000000000000';
helpers.testChildFolderId = 'fo010000-0000-0000-0000-000000000000';

helpers.setupAuth = function setupAuth(hooks) {
  helpers.setupTests(hooks);

  hooks.beforeEach(async function () {
    let tokenResponse = await request(helpers.testUrl)
    .post('/connect/token')
    .send({
      'username': helpers.testLoginUsername,
      'password': helpers.testLoginPassword
    });
    this.authHeader = `Bearer ${tokenResponse.body.jwt}`;
  });

  hooks.afterEach(async function () {
    this.authHeader = null;
  });
}

helpers.setupTests = function setupTests(hooks) {
  hooks.beforeEach(async function () {
    this.server = await Server.init(internals.manifest, internals.composeOptions);
    await this.server.start();
  });

  hooks.afterEach(async function () {
    await this.server.stop();
  });
}

helpers.sleep = function(ms) {
  return new Promise(resolve=>{
    setTimeout(resolve,ms)
  })
 }

internals.manifest = {

  /*
  brittle - coupled to the initialise function for jsonapi-server, otherwise
  we'd use port: 0, and hapi would choose hostname and address by invoking
  `echo hostname` (under the hood). In future we don't even want to start a
  server, b/c we'll use request injection in the tests, but for now, making
  note to remind us that we have to use the config.get settings here to so they
  match those of the jsonapi server initialise function
   */

  server: {
    address: config.get('server.address'),
    host: config.get('server.address'),
    port: config.get('server.port'),
  },
  register: {
    plugins: [
      {
        plugin: Hecks.toPlugin(app, 'express'),
        options: {}
      },
    ],
  }
};

internals.composeOptions = {
  relativeTo: process.cwd(),
};
