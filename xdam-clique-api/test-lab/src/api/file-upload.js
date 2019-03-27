'use strict';

const Code = require('code');
const Lab = require('lab');
const Lolex = require('lolex');
const Server = require('../../../index');
const { authorization } = require('./tmp-helper');

const { expect } = Code;
const { after, before, describe, it } = exports.lab = Lab.script();
const internals = {};

const FOLDER_ID = 'fo010000-0000-0000-0000-000000000000';
describe(`GET /_ops/upload/folders/${FOLDER_ID}/assets/?fileName=foo.jpg should return a presigned s3 url to the client for:`, { timeout: 8000 }, () => {
  let createResponseJson; // TODO: order dependent test!
  let server;
  let date;
  let clock;

  before(async () => {
    server = await Server.init(internals.manifest, internals.composeOptions);
    // TODO: server.start() required when we hit aws s3 getPresigned url endpoint
    // -- use knock npm module to fix this
    await server.start();
    date = new Date("2015-09-25");
    clock = Lolex.install( { now: date });
  });

  after(() => {
    createResponseJson = void 0;
    server = void 0;
    clock.uninstall();
  });

  it(`Case: initial upload of an asset`, async () => {
    const request = {
      method: 'GET',
      url: `/_ops/upload/folders/${FOLDER_ID}/assets?fileName=foo.jpg`,
      headers: { authorization, },
    };

    const res = await server.inject(request);
    createResponseJson = res; // keep presign upload url response in outer scope for use in next test
    const parts = JSON.parse(createResponseJson.payload).signedRequest.split('/');
    const assetId = parts[parts.length - 2].split('?')[0];
    const json = JSON.parse(res.payload);
    expect(json.signedRequest).to.include([
      'https://sls-clique-asset-pipeline-qa-',
      `/original/${assetId}/${clock.now}-foo.jpg`,
      '?AWSAccessKeyId=',
      '&Content-Type=image%2Fjpeg',
      '&Expires=',
      '&x-amz-acl=public-read'
    ]);
    expect(res.statusCode, 'Status code').to.equal(200);
  });

  it(`Case: updating an existing asset with the same fileName`, async () => {
    // use first created asset in first test, to test that we can update the same asset
    const parts = JSON.parse(createResponseJson.payload).signedRequest.split('/');
    const assetId = parts[parts.length - 2].split('?')[0];

    const request = {
      method: 'GET',
      url: `/_ops/upload/folders/${FOLDER_ID}/assets/${assetId}?fileName=foo.jpg`,
      headers: { authorization },
    };

    const res = await server.inject(request);
    const json = JSON.parse(res.payload);
    expect(json.signedRequest).to.include([
      'https://sls-clique-asset-pipeline-qa-',
      `/original/${assetId}/${clock.now}-foo.jpg`,
      '?AWSAccessKeyId=',
      '&Content-Type=image%2Fjpeg',
      '&Expires=',
      '&x-amz-acl=public-read'
    ]);
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
        plugin: './src/api/file-upload',
        options: {}
      },
    ],
  }
};

internals.composeOptions = {
  relativeTo: process.cwd(),
};
