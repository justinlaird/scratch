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
module.skip('Integration | Component | xui-file-dropzone', function(hooks) {
  setupRenderingTest(hooks);

  module("it renders block w/ <input> when actual modelName DOES resolve to 'folder'", function() {
    test('when passed a real pseudo model (viewmodel)', async function(assert) {
      class StubModel {
        containerType = 'folder';
        containerId = '123'
      }

      this.set('model', new StubModel());

      await render(hbs`
        {{#xui-file-dropzone model=model isFolder=(eq model.containerType "folder") folderId=model.containerId}}
          template block text
        {{/xui-file-dropzone}}
      `);

      assert.dom(this.element).hasText('template block text');
      assert.dom('input').exists();
    });

    test('when passed a real model', async function(assert) {
      class StubModel {
        static modelName = 'folder';
      }

      this.set('model', new StubModel());

      await render(hbs`
        {{#xui-file-dropzone model=model}}
          template block text
        {{/xui-file-dropzone}}
      `);

      assert.dom(this.element).hasText('template block text');
      assert.dom('input').exists();
    });
  });

  module("it renders block WITHOUT <input> when actual modelName DOES NOT resolve to 'folder'", function() {
    test('when passed a real pseudo model (viewmodel)', async function(assert) {
      class StubModel {
        static modelName = 'collection';
      }

      this.set('model', new StubModel());

      await render(hbs`
        {{#xui-file-dropzone model=model}}
          template block text
        {{/xui-file-dropzone}}
      `);

      assert.dom(this.element).hasText('template block text');
      assert.dom('input').doesNotExist();
    });

    test('when passed a real model', async function(assert) {
      class StubModel {
        static modelName = 'collection';
      }

      this.set('model', new StubModel());

      await render(hbs`
        {{#xui-file-dropzone model=model}}
          template block text
        {{/xui-file-dropzone}}
      `);

      assert.dom(this.element).hasText('template block text');
      assert.dom('input').doesNotExist();
    });
  });

  module("Does not throw when no model is passed", function() {
    test('when passed a real pseudo model (viewmodel)', async function(assert) {
      this.set('model', null);

      await render(hbs`
        {{#xui-file-dropzone model=model}}
          template block text
        {{/xui-file-dropzone}}
      `);

      assert.dom(this.element).hasText('template block text');
      assert.dom('input').doesNotExist();
    });
  });

});
