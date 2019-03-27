'use strict';

const Code = require('code');
const Lab = require('lab');
const Server = require('../../../index');

const { expect } = Code;
const { /* after, */ /* before, */ describe, it } = exports.lab = Lab.script();

const internals = {};

describe(`json api error responses`, () => {
  it(`should return error payload when passed the wrong content-type header`, async () => {
    const server = await Server.init(internals.manifest, internals.composeOptions);

    server.route({
      method: 'POST',
      path: '/post',
      handler: () => ({
        data: {
          id: 'post',
          type: 'response'
        }
      }),
    });

    const request = {
      method: 'POST',
      url: '/post',
      payload: {
        data: {
          type: 'post',
          attributes: {
            name: 'test'
          }
        }
      },
      headers: {
        accept: 'application/vnd.api+json',
        'content-type': 'application/json', // variant
      }
    };

    const res = await server.inject(request);
    const payload = JSON.parse(res.payload);
    expect(payload).to.include('errors');
    expect(payload.errors).to.have.length(1);
    expect(payload.meta).to.include('id');
    expect(payload.errors[0].detail).to.include('Only `application/vnd.api+json` content-type supported');
  });

  it(`should return error payload missing an endpoint`, async () => {
    const server = await Server.init(internals.manifest, internals.composeOptions);

    server.route({
      method: 'POST',
      path: '/postttttttt',
      handler: () => ({
        data: {
          id: 'post',
          type: 'response'
        }
      }),
    });

    const request = {
      method: 'POST',
      url: '/post',
      payload: {
        data: {
          type: 'post',
          attributes: {
            name: 'test'
          }
        }
      },
      headers: {
        accept: 'application/vnd.api+json',
        'content-type': 'application/json', // variant
      }
    };

    const res = await server.inject(request);
    const payload = JSON.parse(res.payload);
    expect(payload).to.include('errors');
    expect(payload.errors).to.have.length(1);
    expect(payload.meta).to.include('id');
    expect(payload.errors[0].detail).to.include('Not Found');
  });
});

internals.manifest = {
  register: {
    plugins: [
      {
        plugin: require('@gar/hapi-json-api'),
        options: {}
      },
    ],
  }
};

internals.composeOptions = {
  relativeTo: process.cwd(),
};
