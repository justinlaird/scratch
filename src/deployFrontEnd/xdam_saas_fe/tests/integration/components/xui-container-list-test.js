import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | xui-container-list', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    this.set('testAction', () => { // eslint-disable-line
      assert.ok(true, "Filter action called");
    });


    await render(hbs`{{xui-container-list filterAction=(action testAction)}}`);

    assert.dom().hasAnyText();

    // Template block usage:
    await render(hbs`
      {{#xui-container-list filterAction=(action testAction)}}
        template block text
      {{/xui-container-list}}
    `);

    assert.dom().hasAnyText();
  });
});
