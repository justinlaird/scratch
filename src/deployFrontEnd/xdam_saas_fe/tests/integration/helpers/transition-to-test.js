import { module, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | transition-to', function(hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  skip('it renders', async function(assert) {
    this.set('inputValue', '1234');

    await render(hbs`{{transition-to inputValue}}`);

    assert.dom(this.element).hasText('1234');
  });
});
