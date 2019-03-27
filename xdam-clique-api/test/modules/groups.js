const helpers = require('../helpers/helpers');
const QUnit = require('qunit');
const request = require('supertest');

QUnit.module('Assets', function(hooks) {
  helpers.setupAuth(hooks);

  QUnit.test('Test GET groups - expect 200', async function(assert) {
    await request(helpers.testUrl)
      .get('/rest/groups')
      .set('Authorization', this.authHeader)
      .expect(200);

      assert.ok(true, 'Got 200 status');
  });

  QUnit.test('Test GET groups invalid auth - expect 401', async function(assert) {
    await request(helpers.testUrl)
      .get('/rest/groups')
      .set('Authorization', 'Bearer bad.auth.token')
      .expect(401);

      assert.ok(true, 'Got 401 status');
  });

  QUnit.test('Test groups have date stamps ', async function(assert) {
    let response = await request(helpers.testUrl)
      .get('/rest/groups')
      .set('Authorization', this.authHeader)
      .expect(200);

      response.body.data.forEach(element => {
      assert.ok(element.attributes.created.match(helpers.dateISORegex), "Groups date created matches ISO format");
      assert.ok(element.attributes.modified.match(helpers.dateISORegex), "Groups date modified matches ISO format");
      });
  });

  QUnit.test('Test PATCH groups', async function(assert) {
    let response = await request(helpers.testUrl)
      .get(`/rest/groups/${helpers.testGroupId}`)
      .set('Authorization', this.authHeader)
      .expect(200);

    let testGroup = response.body.data;
    let originalName = testGroup.attributes.name;
    let originalModifiedDate = testGroup.attributes.modified;
    let newName = "newtestname";
    testGroup.attributes.name = newName;
    let testGroupRequest = {data: {attributes: testGroup.attributes}};

    await helpers.sleep(1000);
    response = await request(helpers.testUrl)
      .patch(`/rest/groups/${helpers.testGroupId}`)
      .send(testGroupRequest)
      .set('Authorization', this.authHeader)
      .expect(200);

    assert.equal(response.body.data.attributes.name, newName, "Group PATCH updated name");
    assert.notEqual(response.body.data.attributes.modified, originalModifiedDate, "Group PATCH updated modified date");

    testGroup = response.body.data;
    testGroup.attributes.name = originalName;
    testGroupRequest = {data: {attributes: testGroup.attributes}};

    await helpers.sleep(1000);
    response = await request(helpers.testUrl)
      .patch(`/rest/groups/${helpers.testGroupId}`)
      .send(testGroupRequest)
      .set('Authorization', this.authHeader)
      .expect(200);

    assert.equal(response.body.data.attributes.name, originalName, "Group PATCH updated name");
    assert.notEqual(response.body.data.attributes.modified, originalModifiedDate, "Group PATCH updated modified date");
  });


  QUnit.test('Test POST/DELETE groups', async function(assert) {

    let testName = "testName";

    let newTestGroup = {
      "data": {
        "type": "groups",
        "attributes": {
          "name": testName,
          "created" : null,
          "modified" : null
        }
      }
    };

    let response = await request(helpers.testUrl)
      .post(`/rest/groups`)
      .send(newTestGroup)
      .set('Authorization', this.authHeader)
      .expect(201);

    let newGroupId = response.body.data.id;
    console.log(`new ID ${newGroupId}`);

    //fetch the new group by ID
    response = await request(helpers.testUrl)
      .get(`/rest/groups/${newGroupId}`)
      .set('Authorization', this.authHeader)
      .expect(200);

    assert.ok(newGroupId.length > 1, "created new group ID");
    assert.equal(response.body.data.attributes.name, testName, "New group name correct");
    assert.ok(response.body.data.attributes.created.match(helpers.dateISORegex), "Group date created matches ISO format");
    assert.ok(response.body.data.attributes.modified.match(helpers.dateISORegex), "Group date modified matches ISO format");

    //delete the test group
    response = await request(helpers.testUrl)
      .delete(`/rest/groups/${newGroupId}`)
      .set('Authorization', this.authHeader)
      .expect(200);

    //verify the test group is gone
    response = await request(helpers.testUrl)
      .get(`/rest/groups/${newGroupId}`)
      .set('Authorization', this.authHeader)
      .expect(404);

  });

});
