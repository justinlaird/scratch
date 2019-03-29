import EmberObject from '@ember/object';
import QueryParamsMixin from 'xdam-saas-fe/mixins/query-params';
import { module, test } from 'qunit';

module('Unit | Mixin | queryParams', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let QueryParamsObject = EmberObject.extend(QueryParamsMixin);
    let subject = QueryParamsObject.create();
    assert.ok(subject);
  });
});
