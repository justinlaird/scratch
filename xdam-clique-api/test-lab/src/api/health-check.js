'use strict';

const Code = require('code');
const Lab = require('lab');
const Server = require('../../../index');

const { expect } = Code;
const { /* after, */ /* before, afterEach, */ describe, it } = exports.lab = Lab.script();

const internals = {};

describe(`Health Check`, () => {
  it(`does not require authentication token`, async () => {
    const server = await Server.init(internals.manifest, internals.composeOptions);

    const request = {
      method: 'GET',
      url: '/health-check',
    };

    const res = await server.inject(request);
    expect(res.statusCode, 'Status code').to.equal(200);
  });
});

internals.manifest = {
  register: {
    plugins: [
      {
        plugin: './src/api/authorization',
        options: {}
      },
      {
        plugin: './src/api/health-check',
        options: {}
      },
    ],
  }
};

internals.composeOptions = {
  relativeTo: process.cwd(),
};
