import { module, test, skip } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import {
  visit,
  currentRouteName,
  findAll,
  click,
  currentURL
} from '@ember/test-helpers';
import startMirage from 'ember-cli-mirage/start-mirage';
import ENV from 'xdam-saas-fe/config/environment';
import { authenticateSession } from 'ember-simple-auth/test-support';

const internals = {
  C1_D1_P1_FG1_F1_URL: '/folders/48f70522-fa36-4431-bbb5-5c979d2ed655?curr=foldergroups&next=foldergroups&pId=fg010000-0000-0000-0000-000000000000&prev=foldergroups',
  C1_D1_P2_URL: '/?curr=foldergroups&next=foldergroups&pId=1b98db4b-d491-4850-ad46-98503649634f&prev=projects',
  C1_D1_P2_FG1_URL: '/?curr=foldergroups&next=foldergroups&pId=fg030000-0000-0000-0000-000000000000&prev=foldergroups',
  C1_D1_P2_FG1_CHFG1_URL: '/?curr=foldergroups&next=foldergroups&pId=fg040000-0000-0000-0000-000000000000&prev=foldergroups',
  C1_D1_P2_FG1_CHFG1_FOLDER_1_URL: '/folders/58f70522-fa36-4431-bbb5-5c979d2ed655?curr=foldergroups&next=foldergroups&pId=fg040000-0000-0000-0000-000000000000&prev=foldergroups',
  C1_D1_P2_FG1_F1_URL: '/folders/17642f30-8eea-4bda-ba56-b9e9490cd5be?curr=foldergroups&next=foldergroups&pId=fg030000-0000-0000-0000-000000000000&prev=foldergroups',
  TEST_USER_COLLECTION_1: '/collections/07d29f83-a66c-4dba-a2bf-0ce308fa3634',
  TEST_USER_SHARED_COLLECTION_1: '/collections/22b88fc86-0150-4b34-88c0-9072ed76dc7',
  C1_D1_P1_FG2_URL: '/?curr=foldergroups&next=foldergroups&pId=fg020000-0000-0000-0000-000000000000&prev=foldergroups',
  C1_D1_P1_FG2_COLLECTION_1_URL: '/collections/704da2bd-7edf-4e69-8e44-758132589c44?curr=foldergroups&next=foldergroups&pId=fg020000-0000-0000-0000-000000000000&prev=foldergroups'
};

skip('Acceptance | navigation', function(hooks) {
  setupApplicationTest(hooks);
  hooks.beforeEach(function() {
    this.server = startMirage(this.owner);
  });

  hooks.afterEach(function() {
    this.server.shutdown();
  });

  test('main page loads using stub token with mirage (smoke test, requires ember 3.2)', async function(assert) {
    authenticateSession(ENV.STUB_TOKEN);
    await visit('/');
    assert.equal(currentRouteName(), 'main.index');
  });

  module(`Given I directly visit /`, (hooks) => {
    hooks.beforeEach(async function() {
      authenticateSession(ENV.STUB_TOKEN);
      await visit('/');
    }),

    test('then it should see 3 divisions', async function(assert) {
      const selector = '[data-test-drawer-list-group-items]';
      // const buttons = findAll(`${selector} span`);

      // assert.equal(buttons.length, 3, 'should have 3 divisions');
      assert.dom(selector).includesText('C1 Division 1');
      assert.dom(selector).includesText('C1 Division 2');
      assert.dom(selector).includesText('C1 Division 3');
    });

    test('then it should see 0 folders', async function(assert) {
      const selector = '[data-test-drawer-list-group-folders]';
      const buttons = findAll(`${selector} span`);

      assert.equal(buttons.length, 0, 'should have 0 folders');
    });

    test('then it should see 0 collections', async function(assert) {
      const selector = '[data-test-drawer-list-group-collections]';
      const buttons = findAll(`${selector} span`);

      assert.equal(buttons.length, 0, 'should have 0 collections');
    });

    test('then it should see 2 user-collections', async function(assert) {
      const selector = '[data-test-drawer-list-group-user-collections]';
      // const buttons = findAll(`${selector} a`);

      // assert.equal(buttons.length, 2, 'should have 2 user collections');
      assert.dom(selector).includesText('User Justin Collection 1');
      assert.dom(selector).includesText('User Justin Collection 2');
    });

    module(`Given I click the first division`, (hooks) => {
      hooks.beforeEach(async function() {
        const selector = '[data-test-drawer-list-group-items]';
        const button = document.querySelectorAll(`${selector} span`).item(0);
        return await click(button);
      });

      test('then I should should see 3 projects', async function(assert) {
        const selector = '[data-test-drawer-list-group-items]';
        // const buttons = findAll(`${selector} span:not([data-test-drawer-list-group-back])`);

        // assert.equal(buttons.length, 3, 'should see 3 projects');
        assert.dom(selector).includesText('C1 D1 Project 1');
        assert.dom(selector).includesText('C1 D1 Project 2');
        assert.dom(selector).includesText('C1 D1 Project 3');
      });

      module(`Given I click the first project`, (hooks) => {
        hooks.beforeEach(async function() {
          const selector = '[data-test-drawer-list-group-items]';
          const button = document.querySelectorAll(`${selector} span:not([data-test-drawer-list-group-back])`).item(0);
          return await click(button);
        });

        test('then I should see 2 folder groups', async function(assert) {
          const selector = '[data-test-drawer-list-group-items]';
          // const buttons = findAll(`${selector} span:not([data-test-drawer-list-group-back])`);

          // assert.equal(buttons.length, 2, 'should see 2 folder groups');
          assert.dom(selector).includesText('C1 D1 P1 Folder Group 1');
          assert.dom(selector).includesText('C1 D1 P1 Folder Group 2');
        });

        module(`Given I click the first foldergroup`, (hooks) => {
          hooks.beforeEach(async function() {
            const selector = '[data-test-drawer-list-group-items]';
            const button = document.querySelectorAll(`${selector} span:not([data-test-drawer-list-group-back])`).item(0);
            return await click(button);
          });

          test('then I should see 25 folders', async function(assert) {
            const selector = '[data-test-drawer-list-group-folders]'; // <- variant 'group-folders'
            // const buttons = findAll(`${selector} a`);

            // assert.equal(buttons.length, 25, 'should see 25 folders');
            assert.dom(selector).includesText('C1 D1 P1 FG1 Folder 1');
            assert.dom(selector).includesText('C1 D1 P1 FG1 Folder 2');
          });

          module(`Given I click the first folder`, (hooks) => {
            hooks.beforeEach(async function() {
              const selector = '[data-test-drawer-list-group-folders]'; // <- variant 'group-folders'
              const button = document.querySelectorAll(`${selector} a`).item(0);
              return await click(button);
            });

            test('then I should see 50 images at url the correct url', async function(assert) {
              const selector = '.mdc-card__media';
              const images = findAll(selector);

              assert.equal(images.length, 50, 'should see 50 images');
              assert.equal(currentURL(), internals.C1_D1_P1_FG1_F1_URL);
            });
          });
        });
      });
    });
  });

  module(`Given I directly visit ${internals.C1_D1_P2_URL}`, (hooks) => {
    hooks.beforeEach(async function() {
      authenticateSession(ENV.STUB_TOKEN);
      await visit(internals.C1_D1_P2_URL);
    }),

    test('Then i should see a button for going to C1 D1 P2 Folder Group 1', async function(assert) {
      const selector = '[data-test-drawer-list-group-items]';
      const buttons = findAll(`${selector} span:not([data-test-drawer-list-group-back])`);

      assert.equal(buttons.length, 1, 'should see 1 button');
    });

    module(`Given i click button C1 D1 P2 Folder Group 1`, (hooks) => {
      hooks.beforeEach(async function() {
        const selector = '[data-test-drawer-list-group-items]';
        const button = document.querySelectorAll(`${selector} span:not([data-test-drawer-list-group-back])`).item(0);
        return await click(button);
      });

      test('Then I should see a button for each folder in C1 D1 P2 Folder Group 1 at correct url', async function(assert) {
        const selector = '[data-test-drawer-list-group-folders]';
        const buttons = findAll(`${selector} a`);

        assert.equal(buttons.length, 4, 'should see 4 folders');
        assert.dom(selector).includesText('C1 D1 P2 FG1 Folder 1');
        assert.dom(selector).includesText('C1 D1 P2 FG1 Folder 2');
        assert.dom(selector).includesText('C1 D1 P2 FG1 Folder 3');
        assert.dom(selector).includesText('C1 D1 P2 FG1 Folder 4');

        assert.equal(currentURL(), internals.C1_D1_P2_FG1_URL);
      });

      test('And I should see a button for child folder group 1 at the correct url', async function(assert) {
        const selector = '[data-test-drawer-list-group-items]';
        const button = document.querySelectorAll(`${selector} span:not([data-test-drawer-list-group-back])`).item(0);

        assert.dom(button).includesText('C1 D1 P2 FG1 Child Folder Group 1');
        assert.equal(currentURL(), internals.C1_D1_P2_FG1_URL);
      });

      module(`Given I click C1_D1_P2_FG1 Child Folder Group 1`, (hooks) => {
        hooks.beforeEach(async function() {
          const selector = '[data-test-drawer-list-group-items]';
          const button = document.querySelectorAll(`${selector} span:not([data-test-drawer-list-group-back])`).item(0);
          return await click(button);
        });

        test('Then I should see a link to a single folder', async function(assert) {
          const selector = '[data-test-drawer-list-group-folders]';
          const button = find(`${selector} a`);

          assert.dom(button).includesText('C1 D1 P2 FG1 Child Folder Group 1 Folder 1');
          assert.equal(currentURL(), internals.C1_D1_P2_FG1_CHFG1_URL);
        });

        module(`When I click that folder`, (hooks) => {
          hooks.beforeEach(async function() {
            const selector = '[data-test-drawer-list-group-folders]:not([data-test-drawer-list-group-back])'; // <- variant 'group-folders'
            const button = document.querySelectorAll(`${selector} a`).item(0);
            return await click(button);
          });

          test('Then I should see the assets at the correct url', async function(assert) {
            const selector = '.mdc-card__media';
            const images = findAll(selector);

            assert.equal(images.length, 50, 'should see 50 images');
            assert.equal(currentURL(), internals.C1_D1_P2_FG1_CHFG1_FOLDER_1_URL);
          });
        });
      });
    });
  });

  module(`Given i visit C1 D1 P1 FG2`, (hooks) => {
    hooks.beforeEach(async function() {
      authenticateSession(ENV.STUB_TOKEN);
      await visit(internals.C1_D1_P2_URL);
    }),

    test('Then i should see a button for going to C1 D1 P2 Folder Group 1', async function(assert) {
      const selector = '[data-test-drawer-list-group-items]';
      const buttons = findAll(`${selector} span:not([data-test-drawer-list-group-back])`);

      assert.equal(buttons.length, 1, 'should see 1 button');
    });
  });

  module(`Given i directly visit ${internals.C1_D1_P2_FG1_URL}`, (hooks) => {
    hooks.beforeEach(async function() {
      authenticateSession(ENV.STUB_TOKEN);
      await visit(internals.C1_D1_P2_FG1_URL);
    }),

    module(`Given I click the first folder`, (hooks) => {
      hooks.beforeEach(async function() {
        const selector = '[data-test-drawer-list-group-folders]'; // <- variant 'group-folders'
        const button = document.querySelectorAll(`${selector} a`).item(0);
        return await click(button);
      });

      test('then I should see 0 images at url the correct url', async function(assert) {
        const selector = '.mdc-card__media';
        const images = findAll(selector);

        assert.equal(images.length, 0, 'should see 0 images');
        assert.equal(currentURL(), internals.C1_D1_P2_FG1_F1_URL);
      });
    });
  });

  module(`Given I directly visit ${internals.C1_D1_P1_FG2_URL}`, (hooks) => {
    hooks.beforeEach(async function() {
      authenticateSession(ENV.STUB_TOKEN);
      await visit(internals.C1_D1_P1_FG2_URL);
    }),

    module(`Given i click button C1 D1 P1 FG2 Collection 1`, (hooks) => {
      hooks.beforeEach(async function() {
        const selector = '[data-test-drawer-list-group-collections]';
        const button = document.querySelectorAll(`${selector} a`).item(0);
        return await click(button);
      });

      test('Then I should see the assets for that collection', async function(assert) {
        const selector = '.mdc-card__media';
        const images = findAll(selector);

        assert.equal(images.length, 3, 'should see 3 assets');
        assert.equal(currentURL(), internals.C1_D1_P1_FG2_COLLECTION_1_URL);
      });
    });
  });

  module(`Given I directly visit /`, (hooks) => {
    hooks.beforeEach(async function() {
      authenticateSession(ENV.STUB_TOKEN);
      await visit('/');
    });

    module(`When I click the first user collection`, (hooks) => {
      hooks.beforeEach(async function() {
        const selector = '[data-test-drawer-list-group-user-collections]';
        const button = document.querySelectorAll(`${selector} a`).item(0);
        return await click(button);
      });

      test('then i should see 5 assets', async function(assert) {
        const selector = '.mdc-card__media';
        const images = findAll(selector);

        assert.equal(images.length, 5, 'should see 5 assets');
        assert.equal(currentURL(), internals.TEST_USER_COLLECTION_1);
      });
    });

    module(`When I click the first shared collection`, (hooks) => {
      hooks.beforeEach(async function() {
        const selector = '[data-test-drawer-list-group-shared-collections]';
        const button = document.querySelectorAll(`${selector} a`).item(0);
        return await click(button);
      });

      test('then i should see 5 assets', async function(assert) {
        const selector = '.mdc-card__media';
        const images = findAll(selector);

        assert.equal(currentURL(), internals.TEST_USER_SHARED_COLLECTION_1, 'should navigate to expected collection');
        assert.equal(images.length, 5, 'should see 5 assets');
      });
    });

  });

});
