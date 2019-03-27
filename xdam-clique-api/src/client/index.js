'use strict';

require('dotenv').config();
const config  = require('config');
const fetch = require('node-fetch');
const Promise = require('bluebird');
const Hoek = require('hoek');
const Aws = require('aws-sdk');
const t = require('joi');
const lodash = require('lodash');
lodash.mixin(require("lodash-inflection"));

const {
  bucket,
  accessKeyId,
  secretAccessKey,
  region,
} = config.get("Serverless.s3");

// TODO: time to break out nock perhaps
const IS_TEST = process.env.NODE_ENV === 'test'
const TEST_ID = 'ast10000-0000-0000-0000-000000000000';

module.exports = class Client {

  constructor(request = {}) {
    Hoek.assert("server" in request, "request object is not a hapi request object.")
    this.request = request;
  }

  async createAsset({
    id,
    resourceType: type,
    authorization,
    parentId,
    parentResourceType,
    fileName: name,
    mimeType: fileType,
  }) {

    t.assert(id, t.string().optional());
    t.assert(type, t.string().required());
    t.assert(authorization, t.string().required());
    t.assert(parentId, t.string().required());
    t.assert(parentResourceType, t.string().required());
    t.assert(name, t.string().required());
    t.assert(fileType, t.string().required());

    const headers = {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${authorization}`,
    };

    // TODO: if we make a patch here, and the user doesn't actually upload,
    // we'll have the wrong fileName and fileType in the db - we could
    // add these with body.data.attributes = { name, fileType } for POST
    // only requests
    //
    // think more about this
    const body = {
      data: {
        type,
        attributes: {
          name,
          fileType,
        },
        relationships: {
          [lodash.singularize(parentResourceType)]: {
            data: {
              type: parentResourceType,
              id: parentId,
            }
          },
        },
      }
    };

    const method = this.request.params.id ? 'PATCH' : 'POST';
    const apiHost = this.request.server.info.uri;
    const url = method === 'POST' ? `${apiHost}/rest/assets` : `${apiHost}/rest/assets/${id}`;
    return fetch(url, {
      method,
      body: JSON.stringify(body),
      headers,
    })
    .then((res) => res.json());
  }

  async getSignedUrl() {
    const {
      resourceType,
      parentId,
      parentResourceType,
    } = this.request.params;

    const {
      fileName,
    } = this.request.query;

    // For testing, we either doing a patch, so re-use the id from previous
    // post, if not, use a hardcoded TEST_ID - in future nock is how to realy
    // deal with this kind of thing.
    let _id = IS_TEST ? (this.request.params.id || TEST_ID) : this.request.params.id;

    const mimeType = this.request.server.mime.path(fileName).type;
    const name = `${Date.now()}-${fileName}`;
    let json = await this.createAsset({
      id: _id,
      resourceType,
      authorization: this.request.headers.authorization.replace('Bearer ', ''),
      parentId,
      parentResourceType,
      fileName: name,
      mimeType,
    });

    let id = IS_TEST ? (this.request.params.id || _id) : (this.request.params.id || json.data.id);

    const s3 = new Aws.S3({
      accessKeyId,
      secretAccessKey,
      region,
    });

    const s3Params = {
      Bucket: bucket,
      Key: `original/${id}/${name}`,
      Expires: 3600,
      ContentType: mimeType,
      ACL: 'public-read',
    };

    return new Promise((resolve, reject) => {
      s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if (err) { return reject(err); }
        return resolve(data);
      });
    });
  }
}
