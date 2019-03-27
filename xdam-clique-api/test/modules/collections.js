const helpers = require('../helpers/helpers');
const QUnit = require('qunit');
const request = require('supertest');

QUnit.module('Collections', function(hooks) {
  helpers.setupAuth(hooks);

  QUnit.test('Test GET collections - expect 200', async function(assert) {
    await request(helpers.testUrl)
    .get('/rest/collections')
    .set('Authorization', this.authHeader)
    .expect(200);

    assert.ok(true, 'Got 200 status');
  });

  QUnit.test('Test GET collections invalid auth - expect 401', async function(assert) {
    await request(helpers.testUrl)
    .get('/rest/collections')
    .set('Authorization', 'Bearer bad.auth.token')
    .expect(401);

    assert.ok(true, 'Got 401 status');
  });

  QUnit.test('Test collections have date stamps ', async function(assert) {
    let response = await request(helpers.testUrl)
    .get('/rest/collections')
    .set('Authorization', this.authHeader)
    .expect(200);

    response.body.data.forEach(element => {
      assert.ok(element.attributes.created.match(helpers.dateISORegex), "Collections date created matches ISO format");
      assert.ok(element.attributes.modified.match(helpers.dateISORegex), "Collections date modified matches ISO format");
    });
  });

  QUnit.test('Test PATCH collections', async function(assert) {
    let response = await request(helpers.testUrl)
    .get(`/rest/collections/${helpers.testCollectionId}`)
    .set('Authorization', this.authHeader)
    .expect(200);

    let testCollections = response.body.data;
    let originalName = testCollections.attributes.name;
    let originalModifiedDate = testCollections.attributes.modified;
    let newName = "newtestname";
    testCollections.attributes.name = newName;
    let testCollectionsRequest = {data: {attributes: testCollections.attributes}};

    await helpers.sleep(1000);
    response = await request(helpers.testUrl)
    .patch(`/rest/collections/${helpers.testCollectionId}`)
    .send(testCollectionsRequest)
    .set('Authorization', this.authHeader)
    .expect(200);

    assert.equal(response.body.data.attributes.name, newName, "Collections PATCH updated name");
    assert.notEqual(response.body.data.attributes.modified, originalModifiedDate, "Collections PATCH updated modified date");

    testCollections = response.body.data;
    testCollections.attributes.name = originalName;
    testCollectionsRequest = {data: {attributes: testCollections.attributes}};

    await helpers.sleep(1000);
    response = await request(helpers.testUrl)
    .patch(`/rest/collections/${helpers.testCollectionId}`)
    .send(testCollectionsRequest)
    .set('Authorization', this.authHeader)
    .expect(200);

    assert.equal(response.body.data.attributes.name, originalName, "Collections PATCH updated name");
    assert.notEqual(response.body.data.attributes.modified, originalModifiedDate, "Collections PATCH updated modified date");
  });

  QUnit.test('Test POST/DELETE customers', async function(assert) {

    let testName = "testName";

    let newTestCustomer = {
      "data": {
        "type": "customers",
        "attributes": {
          "name": testName,
          "created" : null,
          "modified" : null
        }
      }
    };

    let response = await request(helpers.testUrl)
    .post(`/rest/customers`)
    .send(newTestCustomer)
    .set('Authorization', this.authHeader)
    .expect(201);

    let newCustomerId = response.body.data.id;
    console.log(`new ID ${newCustomerId}`);

    //fetch the new customer by ID
    response = await request(helpers.testUrl)
    .get(`/rest/customers/${newCustomerId}`)
    .set('Authorization', this.authHeader)
    .expect(200);

    assert.ok(newCustomerId.length > 1, "created new customer ID");
    assert.equal(response.body.data.attributes.name, testName, "New customer name correct");
    assert.ok(response.body.data.attributes.created.match(helpers.dateISORegex), "Customer date created matches ISO format");
    assert.ok(response.body.data.attributes.modified.match(helpers.dateISORegex), "Customer date modified matches ISO format");

    //delete the test customer
    response = await request(helpers.testUrl)
    .delete(`/rest/customers/${newCustomerId}`)
    .set('Authorization', this.authHeader)
    .expect(200);

    //verify the test customer is gone
    response = await request(helpers.testUrl)
    .get(`/rest/customers/${newCustomerId}`)
    .set('Authorization', this.authHeader)
    .expect(404);

  });

});
