const helpers = require('../helpers/helpers');
const QUnit = require('qunit');
const request = require('supertest');

QUnit.module('Assets', function(hooks) {
  helpers.setupAuth(hooks);

  QUnit.test('Test GET users - expect 200', async function(assert) {
    await request(helpers.testUrl)
      .get('/rest/users')
      .set('Authorization', this.authHeader)
      .expect(200);

      assert.ok(true, 'Got 200 status');
  });

  QUnit.test('Test GET users invalid auth - expect 401', async function(assert) {
    await request(helpers.testUrl)
      .get('/rest/users')
      .set('Authorization', 'Bearer bad.auth.token')
      .expect(401);

      assert.ok(true, 'Got 401 status');
  });

  QUnit.test('Test GET users/:id', async function(assert) {
    await request(helpers.testUrl)
      .get(`/rest/users/${helpers.testUserId}`)
      .set('Authorization', this.authHeader)
      .expect(200);

      assert.ok(true, 'Got 200 status');
  });

  QUnit.test('Test users have date stamps ', async function(assert) {
    let response = await request(helpers.testUrl)
      .get('/rest/users')
      .set('Authorization', this.authHeader)
      .expect(200);

      response.body.data.forEach(element => {
      assert.ok(element.attributes.created.match(helpers.dateISORegex), "User date created matches ISO format");
      assert.ok(element.attributes.modified.match(helpers.dateISORegex), "User date modified matches ISO format");
      });
  });

  QUnit.test('Test PATCH users', async function(assert) {
    let response = await request(helpers.testUrl)
      .get(`/rest/users/${helpers.testUserId}`)
      .set('Authorization', this.authHeader)
      .expect(200);

    let testUser = response.body.data;
    let originalFirstName = testUser.attributes.firstname;
    let originalModifiedDate = testUser.attributes.modified;
    let newFirstName = "newtestname";
    testUser.attributes.firstname = newFirstName;
    let testUserRequest = {data: {attributes: testUser.attributes}};

    await helpers.sleep(1000);
    response = await request(helpers.testUrl)
      .patch(`/rest/users/${helpers.testUserId}`)
      .send(testUserRequest)
      .set('Authorization', this.authHeader)
      .expect(200);

    assert.equal(response.body.data.attributes.firstname, newFirstName, "User PATCH updated firstname");
    assert.notEqual(response.body.data.attributes.modified, originalModifiedDate, "User PATCH updated modified date");

    testUser = response.body.data;
    testUser.attributes.firstname = originalFirstName;
    testUserRequest = {data: {attributes: testUser.attributes}};

    await helpers.sleep(1000);
    response = await request(helpers.testUrl)
      .patch(`/rest/users/${helpers.testUserId}`)
      .send(testUserRequest)
      .set('Authorization', this.authHeader)
      .expect(200);

    assert.equal(response.body.data.attributes.firstname, originalFirstName, "User PATCH restored firstname");
    assert.notEqual(response.body.data.attributes.modified, originalModifiedDate, "User PATCH updated modified date");
  });

  QUnit.test('Test POST/DELETE users', async function(assert) {

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
          "modified" : null
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
    assert.equal(response.body.data.attributes.firstname, testFirstName, "New user firstname correct");
    assert.equal(response.body.data.attributes.lastname, testLasttName, "New user lastname correct");
    assert.equal(response.body.data.attributes.email, testEmail, "New user email correct");
    assert.equal(response.body.data.attributes.login, testLogin,  "New user login correct");
    assert.equal(response.body.data.attributes.password, testPassword,  "New user password correct");
    assert.ok(response.body.data.attributes.created.match(helpers.dateISORegex), "New user date created matches ISO format");
    assert.ok(response.body.data.attributes.modified.match(helpers.dateISORegex), "New user date modified matches ISO format");

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



