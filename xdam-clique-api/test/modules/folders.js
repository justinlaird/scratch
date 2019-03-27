const helpers = require('../helpers/helpers');
const QUnit = require('qunit');
const request = require('supertest');

QUnit.module('Folders', function(hooks) {
  helpers.setupAuth(hooks);

  QUnit.test('Test GET folders - expect 200', async function(assert) {
    await request(helpers.testUrl)
      .get('/rest/folders')
      .set('Authorization', this.authHeader)
      .expect(200);

      assert.ok(true, 'Got 200 status');
  });

  QUnit.test('Test GET folders invalid auth - expect 401', async function(assert) {
    await request(helpers.testUrl)
      .get('/rest/folders')
      .set('Authorization', 'Bearer bad.auth.token')
      .expect(401);

      assert.ok(true, 'Got 401 status');
  });

  QUnit.test('Test folders have date stamps ', async function(assert) {
    let response = await request(helpers.testUrl)
      .get('/rest/folders')
      .set('Authorization', this.authHeader)
      .expect(200);

      response.body.data.forEach(element => {
      assert.ok(element.attributes.created.match(helpers.dateISORegex), "Folder date created matches ISO format");
      assert.ok(element.attributes.modified.match(helpers.dateISORegex), "Folder date modified matches ISO format");
      });
  });

  QUnit.test('Test PATCH folders', async function(assert) {
    let response = await request(helpers.testUrl)
      .get(`/rest/folders/${helpers.testFolderId}`)
      .set('Authorization', this.authHeader)
      .expect(200);

    let testFolder= response.body.data;
    let originalName = testFolder.attributes.name;
    let originalModifiedDate = testFolder.attributes.modified;
    let newName = "newtestname";
    testFolder.attributes.name = newName;
    let testFolderRequest = {data: {attributes: testFolder.attributes}};

    await helpers.sleep(1000);
    response = await request(helpers.testUrl)
      .patch(`/rest/folders/${helpers.testFolderId}`)
      .send(testFolderRequest)
      .set('Authorization', this.authHeader)
      .expect(200);

    assert.equal(response.body.data.attributes.name, newName, "Folder PATCH updated name");
    assert.notEqual(response.body.data.attributes.modified, originalModifiedDate, "Folder PATCH updated modified date");

    testFolder = response.body.data;
    testFolder.attributes.name = originalName;
    testFolderRequest = {data: {attributes: testFolder.attributes}};

    await helpers.sleep(1000);
    response = await request(helpers.testUrl)
      .patch(`/rest/folders/${helpers.testFolderId}`)
      .send(testFolderRequest)
      .set('Authorization', this.authHeader)
      .expect(200);

    assert.equal(response.body.data.attributes.name, originalName, "Folder PATCH updated name");
    assert.notEqual(response.body.data.attributes.modified, originalModifiedDate, "Folder PATCH updated modified date");
  });


  QUnit.test('Test POST/DELETE folders', async function(assert) {

    let testName = "testName";

    let newTestFolder = {
      "data": {
        "type": "folders",
        "attributes": {
          "name": testName,
          "created" : null,
          "modified" : null
        }
      }
    };

    let response = await request(helpers.testUrl)
      .post(`/rest/folders`)
      .send(newTestFolder)
      .set('Authorization', this.authHeader)
      .expect(201);

    let newFolderId = response.body.data.id;
    console.log(`new ID ${newFolderId}`);

    //fetch the new folder by ID
    response = await request(helpers.testUrl)
      .get(`/rest/folders/${newFolderId}`)
      .set('Authorization', this.authHeader)
      .expect(200);

    assert.ok(newFolderId.length > 1, "created new folder ID");
    assert.equal(response.body.data.attributes.name, testName, "New folder name correct");
    assert.ok(response.body.data.attributes.created.match(helpers.dateISORegex), "Folder date created matches ISO format");
    assert.ok(response.body.data.attributes.modified.match(helpers.dateISORegex), "Folder date modified matches ISO format");

    //delete the test folder
    response = await request(helpers.testUrl)
      .delete(`/rest/folders/${newFolderId}`)
      .set('Authorization', this.authHeader)
      .expect(200);

    //verify the test folder is gone
    response = await request(helpers.testUrl)
      .get(`/rest/folders/${newFolderId}`)
      .set('Authorization', this.authHeader)
      .expect(404);

  });
});
