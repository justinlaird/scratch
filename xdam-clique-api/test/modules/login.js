const QUnit = require('qunit');
const request = require('supertest');
const helpers = require('../helpers/helpers');

QUnit.module(`Login`, function(hooks) {
  helpers.setupTests(hooks);

  QUnit.test('Test valid login - expect 200', async function(assert) {
    await request(helpers.testUrl)
      .post('/connect/token')
      .send({
        'username': helpers.testLoginUsername,
        'password': helpers.testLoginPassword
      })
      .expect(200);
      assert.ok(true, 'Got login token');
  });

  QUnit.test('Test invalid login - expect 401', async function(assert) {
    await request(helpers.testUrl)
      .post('/connect/token')
      .send({
        'username': helpers.testLoginUsername,
        'password': 'wrongpass'
      })
      .expect(401);
      assert.ok(true, 'Got 401 status');
  });
});


