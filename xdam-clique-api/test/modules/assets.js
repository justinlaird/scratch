const helpers = require('../helpers/helpers');
const QUnit = require('qunit');
const request = require('supertest');

QUnit.module('Assets', function(hooks) {
  helpers.setupAuth(hooks);

  QUnit.test('Test GET assets - expect 200', async function(assert) {
    await request(helpers.testUrl)
      .get('/rest/assets')
      .set('Authorization', this.authHeader)
      .expect(200);

      assert.ok(true, 'Got 200 status');
  });

  QUnit.test('Test GET assets invalid auth - expect 401', async function(assert) {
    await request(helpers.testUrl)
      .get('/rest/assets')
      .set('Authorization', 'Bearer bad.auth.token')
      .expect(401);

      assert.ok(true, 'Got 401 status');
  });

  QUnit.test('Test assets have date stamps ', async function(assert) {
    let response = await request(helpers.testUrl)
      .get('/rest/assets')
      .set('Authorization', this.authHeader)
      .expect(200);

      response.body.data.forEach(element => {
       assert.ok(element.attributes.created.match(helpers.dateISORegex), "Assets date created matches ISO format");
       assert.ok(element.attributes.modified.match(helpers.dateISORegex), "Assets date modified matches ISO format");
      });
  });

  QUnit.test('Test PATCH assets', async function(assert) {

    let response = await request(helpers.testUrl)
      .get(`/rest/assets/${helpers.testAssetId}`)
      .set('Authorization', this.authHeader)
      .expect(200);

    let testAsset = response.body.data;
    let originalName = testAsset.attributes.name;
    let originalModifiedDate = testAsset.attributes.modified;
    let newName = "newtestname";
    testAsset.attributes.name = newName;
    let testAssetRequest = {data: {attributes: testAsset.attributes}};

    await helpers.sleep(1000);
    response = await request(helpers.testUrl)
      .patch(`/rest/assets/${helpers.testAssetId}`)
      .send(testAssetRequest)
      .set('Authorization', this.authHeader)
      .expect(200);

    assert.equal(response.body.data.attributes.name, newName, "Asset PATCH updated name");
    assert.notEqual(response.body.data.attributes.modified, originalModifiedDate, "Asset PATCH updated modified date");

    testAsset = response.body.data;
    testAsset.attributes.name = originalName;
    testAssetRequest = {data: {attributes: testAsset.attributes}};

    await helpers.sleep(1000);
    response = await request(helpers.testUrl)
      .patch(`/rest/assets/${helpers.testAssetId}`)
      .send(testAssetRequest)
      .set('Authorization', this.authHeader)
      .expect(200);

    assert.equal(response.body.data.attributes.name, originalName, "Asset PATCH updated name");

    // THIS WILL FAIL INDETERMINATELY, if u use rds, probably almost never, if u use local, pretty easily
    assert.notEqual(response.body.data.attributes.modified, originalModifiedDate, "Asset PATCH updated modified date");
  });

  QUnit.test('Test POST/DELETE assets', async function(assert) {

    let testName = "testName";

    let newTestAsset = {
      "data": {
        "type": "assets",
        "attributes": {
          "name": testName,
          "location" : 's3.amazon.com/my-s3-bucket',
          "fileType" : 'image/jpeg',
          "created" : null,
          "modified" : null
        }
      }
    };

    let response = await request(helpers.testUrl)
      .post(`/rest/assets`)
      .send(newTestAsset)
      .set('Authorization', this.authHeader)
      .expect(201);

    let newAssetId = response.body.data.id;

    //fetch the new asset by ID
    response = await request(helpers.testUrl)
      .get(`/rest/assets/${newAssetId}`)
      .set('Authorization', this.authHeader)
      .expect(200);

    assert.ok(newAssetId.length > 1, "created new asset ID");
    assert.equal(response.body.data.attributes.name, testName, "New asset name correct");
    assert.ok(response.body.data.attributes.created.match(helpers.dateISORegex), "Asset date created matches ISO format");
    assert.ok(response.body.data.attributes.modified.match(helpers.dateISORegex), "Asset date modified matches ISO format");

    //delete the test asset
    response = await request(helpers.testUrl)
      .delete(`/rest/assets/${newAssetId}`)
      .set('Authorization', this.authHeader)
      .expect(200);

    //verify the test asset is gone
    response = await request(helpers.testUrl)
      .get(`/rest/assets/${newAssetId}`)
      .set('Authorization', this.authHeader)
      .expect(404);

  });
});
