import Application from '@ember/application';

import { initialize } from 'xdam-saas-fe/initializers/pointer-events';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';

module('Unit | Initializer | pointer-events', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.TestApplication = Application.extend();
    this.TestApplication.initializer({
      name: 'pointer-events',
      initialize
    });

    this.application = this.TestApplication.create({ autoboot: false });
  });

  hooks.afterEach(function() {
    run(this.application, 'destroy');
  });

  // Replace this with your real tests.
  test('it works with pointer events', async function(assert) {
    assert.expect(1);

    return run(async () => {
      await this.application.boot();
      assert.ok(true);
    });
  });
});
