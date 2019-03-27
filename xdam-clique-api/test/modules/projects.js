const helpers = require('../helpers/helpers');
const QUnit = require('qunit');
const request = require('supertest');


QUnit.module('Projects', function(hooks) {
  helpers.setupAuth(hooks);

  QUnit.test('Test GET projects - expect 200', async function(assert) {
    await request(helpers.testUrl)
    .get('/rest/projects')
    .set('Authorization', this.authHeader)
    .expect(200);

    assert.ok(true, 'Got 200 status');
  });

  QUnit.test('Test GET projects invalid auth - expect 401', async function(assert) {
    await request(helpers.testUrl)
    .get('/rest/projects')
    .set('Authorization', 'Bearer bad.auth.token')
    .expect(401);

    assert.ok(true, 'Got 401 status');
  });

  QUnit.test('Test projects have date stamps ', async function(assert) {
    let response = await request(helpers.testUrl)
    .get('/rest/projects')
    .set('Authorization', this.authHeader)
    .expect(200);

    response.body.data.forEach(element => {
      assert.ok(element.attributes.created.match(helpers.dateISORegex), "Project date created matches ISO format");
      assert.ok(element.attributes.modified.match(helpers.dateISORegex), "Project date modified matches ISO format");
    });
  });

  QUnit.test('Test PATCH projects', async function(assert) {
    let response = await request(helpers.testUrl)
    .get(`/rest/projects/${helpers.testProjectId}`)
    .set('Authorization', this.authHeader)
    .expect(200);

    let testProject = response.body.data;
    let originalName = testProject.attributes.name;
    let originalModifiedDate = testProject.attributes.modified;
    let newName = "newtestname";
    testProject.attributes.name = newName;
    let testProjectRequest = {data: {attributes: testProject.attributes}};

    await helpers.sleep(1000);
    response = await request(helpers.testUrl)
    .patch(`/rest/projects/${helpers.testProjectId}`)
    .send(testProjectRequest)
    .set('Authorization', this.authHeader)
    .expect(200);

    assert.equal(response.body.data.attributes.name, newName, "Project PATCH updated name");
    assert.notEqual(response.body.data.attributes.modified, originalModifiedDate, "Project PATCH updated modified date");

    testProject = response.body.data;
    testProject.attributes.name = originalName;
    testProjectRequest = {data: {attributes: testProject.attributes}};

    await helpers.sleep(1000);
    response = await request(helpers.testUrl)
    .patch(`/rest/projects/${helpers.testProjectId}`)
    .send(testProjectRequest)
    .set('Authorization', this.authHeader)
    .expect(200);

    assert.equal(response.body.data.attributes.name, originalName, "Project PATCH updated name");
    assert.notEqual(response.body.data.attributes.modified, originalModifiedDate, "Project PATCH updated modified date");
  });


  QUnit.test('Test POST/DELETE projects', async function(assert) {

    let testName = "testName";

    let newTestProject = {
      "data": {
        "type": "projects",
        "attributes": {
          "name": testName,
          "created" : null,
          "modified" : null
        }
      }
    };

    let response = await request(helpers.testUrl)
    .post(`/rest/projects`)
    .send(newTestProject)
    .set('Authorization', this.authHeader)
    .expect(201);

    let newProjectId = response.body.data.id;
    console.log(`new ID ${newProjectId}`);

    //fetch the new project by ID
    response = await request(helpers.testUrl)
    .get(`/rest/projects/${newProjectId}`)
    .set('Authorization', this.authHeader)
    .expect(200);

    assert.ok(newProjectId.length > 1, "created new project ID");
    assert.equal(response.body.data.attributes.name, testName, "New project name correct");
    assert.ok(response.body.data.attributes.created.match(helpers.dateISORegex), "Project date created matches ISO format");
    assert.ok(response.body.data.attributes.modified.match(helpers.dateISORegex), "Project date modified matches ISO format");

    //delete the test project
    response = await request(helpers.testUrl)
    .delete(`/rest/projects/${newProjectId}`)
    .set('Authorization', this.authHeader)
    .expect(200);

    //verify the test project is gone
    response = await request(helpers.testUrl)
    .get(`/rest/projects/${newProjectId}`)
    .set('Authorization', this.authHeader)
    .expect(404);

  });

});
