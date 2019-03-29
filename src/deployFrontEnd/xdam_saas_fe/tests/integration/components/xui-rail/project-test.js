import Seeds from 'clique-seeds';
import hbs from 'htmlbars-inline-precompile';
import { module, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, findAll } from '@ember/test-helpers';
import { authenticateSession } from 'ember-simple-auth/test-support';

import ENV from 'xdam-saas-fe/config/environment';

module('Integration | Component | xui-rail/project', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(async function () {
    await authenticateSession(ENV.STUB_TOKEN);

    const appMain = this.owner.lookup('service:app-main');
    await appMain._setCurrentUser();

    this.store = this.owner.lookup('service:store');
    this.appMain = this.owner.lookup('service:app-main');
    await this.appMain._setCurrentUser();

    this.seeds = new Seeds(Date.now());
    this.seeds.init();
  });

  skip('each section toggles & loads', async function(assert) {
    await render(hbs`{{xui-rail/project}}`);

    const sectionToggles = findAll('[data-test-section-toggle]');
    sectionToggles.forEach(async section => {
      await click(section);

      // Verify each list renders at least on item. If no resources exist within the given
      // section, an empty content message should be provided at the very least.
      const listItems = findAll(`[data-test-section-list="${section.dataset.testSectionToggle}"] li`);
      assert.ok(listItems.length > 0);
    });
  });

  skip('directory items will drop down', function(assert) {
    // TODO: Make sure both children and grandchildren will drop down
  });

  skip('directory items will drill down', async function(assert) {
    // TODO: Make sure both children and grandchildren will drill down
  });

  skip('directory will render both collections and folders', async function(assert) {

  });

  skip('will drill backwards to rootfolder', async function(assert) {

  });

  skip('empty content messages show for each section', async function(assert) {

  });

  /* ============ Mobile Specific Tests ============= */

  skip('only one section will be open at a time', async function(assert) {

  });

  skip('clicking a section child & grandchild will toggle the rail', async function(assert) {

  });
});
