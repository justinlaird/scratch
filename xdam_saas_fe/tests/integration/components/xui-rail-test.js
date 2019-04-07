import ENV from 'xdam-saas-fe/config/environment';
import hbs from 'htmlbars-inline-precompile';
import { module, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setBreakpoint } from 'ember-responsive/test-support';
import { render, click, waitFor, find } from '@ember/test-helpers';
import {
  authenticateSession,
  currentSession
} from 'ember-simple-auth/test-support';

module('Integration | Component | xui-rail', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(async function () {
    await authenticateSession(ENV.STUB_TOKEN);

    const appMain = this.owner.lookup('service:app-main');
    await appMain._setCurrentUser();
  });

  skip('it renders with default panel', async function(assert) {
    assert.expect(1);

    await render(hbs`{{xui-rail}}`);

    // Checking if one xui-panel-* component is rendered
    assert.dom('[data-test-xui-panel]').exists();
  });

  skip('logout action works for logout tab', async function(assert) {
    assert.expect(2);

    await render(hbs`{{xui-rail}}`);

    assert.equal(currentSession().get('isAuthenticated'), true);

    await click('[data-test-xui-rail-tab="Logout"]');

    assert.equal(currentSession().get('isAuthenticated'), false);
  });

  skip('renders a panel when clicking tab', async function(assert) {
    assert.expect(2);

    await render(hbs`{{xui-rail}}`);

    await click('[data-test-xui-rail-tab="Project"]');
    assert.ok(await waitFor('[data-test-xui-panel="Project"]'));

    await click('[data-test-xui-rail-tab="Search"]');
    assert.ok(await waitFor('[data-test-xui-panel="Search"]'));
  });

  skip('clicking the active tab will toggle the rail content', async function(assert) {
    assert.expect(1);
    setBreakpoint('mobile');

    await render(hbs`{{xui-rail}}`);

    const { testXuiPanel } = find('[data-test-xui-panel]').dataset;
    await click(`[data-test-xui-rail-tab="${testXuiPanel}"]`);

    assert.ok(await waitFor(`[data-test-xui-panel="${testXuiPanel}"]`));
  });
});
