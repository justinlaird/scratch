import { module, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | xui-rail/project/item', function(hooks) {
  setupRenderingTest(hooks);

  skip('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{xui-rail/project/item}}`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      {{#xui-rail/project/item}}
        template block text
      {{/xui-rail/project/item}}
    `);

    assert.dom(this.element).hasText('template block text');
  });
});
