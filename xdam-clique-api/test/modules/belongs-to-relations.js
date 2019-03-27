const helpers = require('../helpers/helpers');
const QUnit = require('qunit');
const request = require('supertest');
const _ = {
  some: require('lodash/some'),
};

QUnit.module('Belongs-to Relationships', function(hooks) {
  helpers.setupAuth(hooks);

  QUnit.test('Test Filter by recursive relationship parent  - folders -> folders', async function(assert) {
    let response = await request(helpers.testUrl)
      .get(`/rest/folders?filter[folder]=${helpers.testParentFolderId}`)
      .set('Authorization', this.authHeader)
      .expect(200);

      assert.ok(true, 'Got 200 status');
      assert.ok(_.some(response.body.data, ['id', helpers.testChildFolderId]), `Filter query found folder ${helpers.testChildFolderId} as child of folder ${helpers.testParentFolderId}`);
  });



  QUnit.test('Test GET project has parent customer', async function(assert) {
    let response = await request(helpers.testUrl)
      .get(`/rest/projects/${helpers.testProjectId}`)
      .set('Authorization', this.authHeader)
      .expect(200);

      assert.ok(true, 'Got 200 status');
      assert.equal(response.body.data.relationships.customer.data.id, helpers.testCustomerId,  "Project ${helpers.testProjectId} has parent customer");
  });



  QUnit.test('Test Create user belonging to customer', async function(assert) {

    let testFirstName = "testfirst";
    let testLasttName = "testlast";
    let testEmail =  "justin@xdam.com";
    let testLogin =   "testlogin";
    let testPassword =   "testpass";

    let newTestUser = {
      "data": {
        "type": "users",
        "attributes": {
          "firstname": testFirstName,
          "lastname": testLasttName,
          "email": testEmail,
          "login": testLogin,
          "password": testPassword,
          "created" : null,
          "modified" : null,
          "customer" : { type: 'customers', id : helpers.testCustomerId }
        }
      }
    };

    let response = await request(helpers.testUrl)
      .post(`/rest/users`)
      .send(newTestUser)
      .set('Authorization', this.authHeader)
      .expect(201);

    let newUserId = response.body.data.id;
    console.log(`new ID ${newUserId}`);

    //fetch the new user by ID
    response = await request(helpers.testUrl)
      .get(`/rest/users/${newUserId}`)
      .set('Authorization', this.authHeader)
      .expect(200);

    assert.ok(newUserId.length > 1, "created new user ID");
    assert.equal(response.body.data.relationships.customer.data.id, helpers.testCustomerId,  "New user customer is correct");

    //delete the test user
    response = await request(helpers.testUrl)
      .delete(`/rest/users/${newUserId}`)
      .set('Authorization', this.authHeader)
      .expect(200);


    //verify the test user is gone
    response = await request(helpers.testUrl)
      .get(`/rest/users/${newUserId}`)
      .set('Authorization', this.authHeader)
      .expect(404);

  });

});




