import { module, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | xui-dialog', function(hooks) {
  setupRenderingTest(hooks);

  skip('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{xui-dialog}}`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      {{#xui-dialog}}
        template block text
      {{/xui-dialog}}
    `);

    assert.dom(this.element).hasText('template block text');
  });
});
