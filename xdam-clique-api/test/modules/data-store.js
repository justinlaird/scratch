const helpers = require('../helpers/helpers');
const QUnit = require('qunit');
const Store = require('../../services/data-store');
const { Model } = require('sequelize');
const some = require('lodash/some');



QUnit.module('`Data Store', function(hooks) {
  helpers.setupTests(hooks);

  QUnit.test('Store.resourceKeys - Test get resource keys', async function(assert) {
    let resourceKeys = Store.resourceKeys();
    assert.ok(Array.isArray(resourceKeys), "Store.resourceKeys() returns an array");
    assert.ok(resourceKeys.includes('users'), "Store.resourceKeys() has 'users' key" );
    assert.ok(resourceKeys.includes('assets'), "Store.resourceKeys() has 'assets' key" );

  });

  QUnit.test('Store.resourceForKey - Test get resource for key', async function(assert) {
    let resource  = Store.resourceForKey('assets');

    assert.ok(resource.baseModel.prototype instanceof Model  , "Store.resourceForKey('users').baseModel instanceof sequelize Model ");
  });

  QUnit.test('Store.findResourceDataById', async function(assert) {
    let result  = await Store.findResourceDataById('assets', helpers.testAssetId);
    assert.ok(result.name = 'XDAM_00001.jpg'  , `Store.findResourceDataById('assets', ${helpers.testAssetId}) returns expected image`);
    assert.ok(some(result.collections, ['id', helpers.testCollectionId]), `Store.findResourceDataById('assets', ${helpers.testAssetId}) has relationship to collection  ${helpers.testCollecionId}`);
  });



  QUnit.test('Store.findOneResourceByFilter', async function(assert) {
    const  params =  {
      login: helpers.testLoginUsername,
      password: helpers.testLoginPassword
    };

    let result  = await Store.findOneResourceByFilter('users', params);

    assert.ok('users' === result.type, "Store.findOneResourceByFilter returns user object");
  });

});
