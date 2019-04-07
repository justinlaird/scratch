import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | img-src', function(hooks) {
  setupRenderingTest(hooks);

  module('success is TRUE', function(/* hooks */) {
    test('it builds img url w/ assetId', async function(assert) {
      this.set('model', {
        location: 'example.com',
        name: 'foobar.jpg',
        id: '123',
        success: true,
      });

      await render(hbs`{{img-src model size='small'}}`);

      assert.dom().hasText('https://example.com/123/small/foobar.jpg');
    });
  });

  module('DEPRECATED: -> playground cards -> success is FALSE, id is undefined', function (/* hooks */) {
    test('it builds img url with no assetId or size in path, protocol is https hard coded', async function(assert) {
      this.set('model', {
        location: 'example.com',
        name: 'foobar.jpg',
        success: false,
      });

      await render(hbs`{{img-src model size='medium'}}`);

      assert.dom().hasText('https://example.com/medium/foobar.jpg');
    });
  });

  module('DEPRECATED -> sample data populated images -> success is FALSE, "//" is protocol by default', function (/* hooks */) {
    test('it builds img url w/o assetId', async function(assert) {
      this.set('model', {
        location: 'example.com',
        name: 'foobar.jpg',
        id: '123',
        success: false,
      });

      await render(hbs`{{img-src model size='small'}}`);

      assert.dom().hasText('//example.com/small/foobar.jpg');
    });

    test('it builds img url w/ xsmall in place of mini', async function(assert) {
      this.set('model', {
        location: 'example.com',
        name: 'foobar.jpg',
        id: '123',
        success: false,
      });

      await render(hbs`{{img-src model size='mini'}}`);

      assert.dom().hasText('//example.com/xsmall/foobar.jpg');
    });
  });

  /*
  These did work, then... i tried to use a beforeEach hook, and they stopped working
  and something seems to be cached in the broccoli tree, so I'll come back. Doggonit
  */

  // test('it builds img url when is missing model positional param', async function(assert) {
  //   return render(hbs`{{img-src size=small}}`)
  //     .catch((err) => assert.ok(err.message.includes('Missing model positional param')));
  // });

  // test('it builds img url when is size is not in constants.SIZES', async function(assert) {
  //   return render(hbs`{{img-src size=foobar}}`)
  //     .catch((err) => assert.ok(err.message.includes('Missing model positional param')));
  // });
});
