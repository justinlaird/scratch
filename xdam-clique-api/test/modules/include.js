const helpers = require('../helpers/helpers');
const QUnit = require('qunit');
const request = require('supertest');
const _ = {
  some: require('lodash/some'),
};

QUnit.module('Include params', function(hooks) {
  helpers.setupAuth(hooks);

  QUnit.test('Test include root folder children', async function(assert) {
    let response = await request(helpers.testUrl)
      .get(`/rest/projects/${helpers.testProjectId}?include=rootFolder.folders.collections,rootFolder.folders.folders,rootFolder.collections`)
      .set('Authorization', this.authHeader)
      .expect(200);

      assert.ok(true, 'Got 200 status');
      assert.ok(_.some(response.body.included, ['id', helpers.testChildFolderId]), `Test include root folder children ${helpers.testChildFolderId} as child of folder ${helpers.testParentFolderId}`);
      assert.ok(_.some(response.body.included, ['id', helpers.testIncludedCollectonId]), `Test include root folder children ${helpers.testChildFolderId} as child of folder ${helpers.testParentFolderId}`);
  });
});
