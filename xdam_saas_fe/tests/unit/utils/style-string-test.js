import styleString from 'xdam-saas-fe/utils/style-string';
import { module, test } from 'qunit';

module('Unit | Utility | styleString', function(hooks) {

  test('it works', function(assert) {
    assert.equal(styleString({ width: '25%', paddingTop: '2px' }), 'width:25%;padding-top:2px;');
    assert.equal(styleString({}), '');

    assert.throws(() => styleString(null), new Error('styles argument must be an Object data type'));
    assert.throws(() => styleString([]), new Error('styles argument must be an Object data type'));
    assert.throws(() => styleString(Symbol()), new Error('styles argument must be an Object data type'));
    assert.throws(() => styleString(1), new Error('styles argument must be an Object data type'));
    assert.throws(() => styleString(''), new Error('styles argument must be an Object data type'));
    assert.throws(() => styleString(true), new Error('styles argument must be an Object data type'));

    assert.throws(() => styleString({ zoom: '1' }), new Error('Style property zoom should have a number value'));
    assert.throws(() => styleString({ zoom: [] }), new Error('Style property zoom should have a number value'));
    assert.throws(() => styleString({ width: '' }), new Error('Value cannot be empty for width property'));
  });

});
