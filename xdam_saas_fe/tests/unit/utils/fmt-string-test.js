import {
  humanize,
  titleize,
  singularize,
  pluralize
} from 'xdam-saas-fe/utils/fmt-string';
import { module, test } from 'qunit';

module('Unit | Utility | fmt-string', function(/* hooks */) {

  test('all custom string utils must pass a string', async function(assert) {
    assert.throws(() => humanize(undefined), /Must pass string/);
    assert.throws(() => titleize(undefined), /Must pass string/);
  });

  // Replace this with your real tests.
  test('humanize', function(assert) {
    assert.equal(humanize('foo-bar'), 'Foo bar');
    assert.equal(humanize('foo_bar'), 'Foo bar');
  });

  test('titleize', function(assert) {
    assert.equal(titleize('foo-bar'), 'Foo Bar');
    assert.equal(titleize('foo_bar'), 'Foo Bar');
    assert.equal(titleize('foo bar'), 'Foo Bar');
  });

  test('singularize - with the letter s at the end', async function(assert) {
    assert.equal(singularize('foos'), 'foo');
  });

  test('pluralize - with the letter s at the end', async function(assert) {
    assert.equal(pluralize('foo'), 'foos');
  });

  module(`singularize and pluralize use ember-inflector`, (/* hooks */) => {
    test("singularize('octopi') -> octopus", async function(assert) {
      assert.equal(singularize('octopi'), 'octopus', 'ember-inflector should work');
    });

    test('pluralizing an already pluralized word should not double pluralize it', async function(assert) {
      assert.equal(pluralize('foos'), 'foos', 'should not re-pluralize the word');
    });
  });
});
