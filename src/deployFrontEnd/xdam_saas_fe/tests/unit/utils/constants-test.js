import constants from 'xdam-saas-fe/utils/constants';
import { module, test } from 'qunit';

module('Unit | Utility | constants', function(hooks) {

  // Replace this with your real tests.
  test('it works', function(assert) {
    let result = constants;
    assert.ok(Object.prototype.toString.call(result) === '[object Object]',
      'default export is an object');
  });
});
