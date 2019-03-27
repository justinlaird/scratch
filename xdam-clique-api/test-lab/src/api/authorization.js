'use strict';

const Code = require('code');
const Lab = require('lab');
const Server = require('../../../index');
const { authorization } = require('./tmp-helper');

const { expect } = Code;
const { /* after, */ /* before, */ afterEach, describe, it } = exports.lab = Lab.script();

const internals = {};

describe(`Authorization`, () => {
  it(`A GET request REQUIRES an authorization header`, async () => {
    const server = await Server.init(internals.manifest, internals.composeOptions);

    server.route({
      method: 'GET',
      path: '/auth-check',
      handler: () => 'ok'
    });

    const request = {
      method: 'GET',
      url: '/auth-check',
    };

    const res = await server.inject(request);

    expect(res.statusCode, 'Status code').to.equal(401);
  });

  it(`GET requests only require authorization header, and do not need an application/vnd.api+json accept header`, async () => {
    const server = await Server.init(internals.manifest, internals.composeOptions);

    server.route({
      method: 'GET',
      path: '/auth-check',
      handler: () => 'ok'
    });

    const request = {
      method: 'GET',
      url: '/auth-check',
      headers: { authorization },
    };

    const res = await server.inject(request);
    expect(res.statusCode, 'Status code').to.equal(200);
  });

  it(`A GET request with invalid auth token will throw with 401`, async () => {
    const server = await Server.init(internals.manifest, internals.composeOptions);

    server.route({
      method: 'GET',
      path: '/auth-check',
      handler: () => 'ok'
    });

    const request = {
      method: 'GET',
      url: '/auth-check',
      headers: { authorization: 'Bearer xxx' },
    };

    const res = await server.inject(request);
    expect(res.statusCode, 'Status code').to.equal(401);
    expect(res.payload).includes('Invalid credentials');
  });

  it(`credentials: default can be used to bypass having to authenticate in tests`, async () => {
    const server = await Server.init(internals.manifest, internals.composeOptions);

    server.route({
      method: 'GET',
      path: '/auth-check',
      handler: () => 'ok'
    });

    const request = {
      method: 'GET',
      url: '/auth-check',
      credentials: 'default',
    };

    const res = await server.inject(request);
    expect(res.statusCode, 'Status code').to.equal(200);
  });

  describe(`it can be disabled`, () => {
    const findAuthPlugin = () => {
      return internals.manifest.register.plugins.find((p) => p.plugin.includes('authorization'));
    }

    afterEach(() => {
      findAuthPlugin().options = {};
    });

    it(`it can be disabled`, async () => {
      findAuthPlugin().options = { disable: true };
      const server = await Server.init(internals.manifest, internals.composeOptions);

      server.route({
        method: 'GET',
        path: '/auth-check',
        handler: () => 'ok'
      });

      const request = {
        method: 'GET',
        url: '/auth-check',
        headers: { authorization: 'Bearer xxx' },
      };

      const res = await server.inject(request);
      expect(res.statusCode, 'Status code').to.equal(200);
    });
  });
});

internals.manifest = {
  register: {
    plugins: [
      {
        plugin: '@gar/hapi-json-api',
        options: {}
      },
      {
        plugin: './src/api/authorization',
        options: {}
      },
      {
        plugin: './src/api/file-upload',
        options: {}
      },
    ],
  }
};

internals.composeOptions = {
  relativeTo: process.cwd(),
};
