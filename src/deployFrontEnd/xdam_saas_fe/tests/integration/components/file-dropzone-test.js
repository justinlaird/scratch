import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

// TODO: configure chrome headless to suport webgl
/*
XDAM-SaaS-FE |  While executing test: Integration | Component | file-dropzone: it renders
XDAM-SaaS-FE |     ---
XDAM-SaaS-FE |         Log: |
XDAM-SaaS-FE |             { type: 'error',
XDAM-SaaS-FE |               testContext:
XDAM-SaaS-FE |                { id: 63,
XDAM-SaaS-FE |                  name: 'Integration | Component | file-dropzone: it renders',
XDAM-SaaS-FE |                  items: [],
XDAM-SaaS-FE |                  state: 'executing' },
XDAM-SaaS-FE |               text:
XDAM-SaaS-FE |                'Uncaught Error: Couldn\'t get a WebGL context at http://localhost:7357/assets/vendor.js
 */
module.skip('Integration | Component | file-dropzone', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{file-dropzone}}`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      {{#file-dropzone}}
        template block text
      {{/file-dropzone}}
    `);

    assert.dom(this.element).hasText('template block text');
  });
});
