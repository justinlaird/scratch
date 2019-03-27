const helpers = require('../helpers/helpers');
const QUnit = require('qunit');
const request = require('supertest');

QUnit.module('Patch', function(hooks) {
  helpers.setupAuth(hooks);

  QUnit.test('Test identical PATCH calls', async function(assert) {
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

    response = await request(helpers.testUrl)
      .patch(`/rest/assets/${helpers.testAssetId}`)
      .send(testAssetRequest)
      .set('Authorization', this.authHeader)
      .expect(200);

    assert.equal(response.body.data.attributes.name, newName, "Asset PATCH updated name");

    //make sure multiple identical PATCH requests don't trigger 500 error
    response = await request(helpers.testUrl)
      .patch(`/rest/assets/${helpers.testAssetId}`)
      .send(testAssetRequest)
      .set('Authorization', this.authHeader)
      .expect(200);

    assert.equal(response.body.data.attributes.name, newName, "Asset PATCH updated name");

    //make sure multiple identical PATCH requests don't trigger 500 error
    response = await request(helpers.testUrl)
      .patch(`/rest/assets/${helpers.testAssetId}`)
      .send(testAssetRequest)
      .set('Authorization', this.authHeader)
      .expect(200);

    assert.equal(response.body.data.attributes.name, newName, "Asset PATCH updated name");

    //make sure multiple identical PATCH requests don't trigger 500 error
    response = await request(helpers.testUrl)
      .patch(`/rest/assets/${helpers.testAssetId}`)
      .send(testAssetRequest)
      .set('Authorization', this.authHeader)
      .expect(200);

    assert.equal(response.body.data.attributes.name, newName, "Asset PATCH updated name");


    testAsset = response.body.data;
    testAsset.attributes.name = originalName;
    testAssetRequest = {data: {attributes: testAsset.attributes}};

    //revert to original name
    await helpers.sleep(1000);
    response = await request(helpers.testUrl)
      .patch(`/rest/assets/${helpers.testAssetId}`)
      .send(testAssetRequest)
      .set('Authorization', this.authHeader)
      .expect(200);

    assert.equal(response.body.data.attributes.name, originalName, "Asset PATCH updated name");
    assert.notEqual(response.body.data.attributes.modified, originalModifiedDate, "Asset PATCH updated modified date");
  });
});
