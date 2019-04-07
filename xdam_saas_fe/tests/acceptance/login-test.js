import { module, test, skip } from 'qunit';
import { visit, fillIn, click, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import startMirage from 'ember-cli-mirage/start-mirage';

module('Acceptance | login', function (hooks) {
  setupApplicationTest(hooks);
  hooks.beforeEach(function() {
    this.server = startMirage(this.owner);
  });

  hooks.afterEach(function() {
    this.server.shutdown();
  });

  test('visiting / unauthenticated redirects to login', async function(assert) {
    await visit('/');
    assert.equal(currentURL(), '/login');
  });

  test('visiting /login', async function (assert) {
    await visit('/login');
    assert.equal(currentURL(), '/login');
  });

  skip('Log in with valid credentials', async function (assert) {
    let username = 'justin';
    let password = 'test';
    await visit('/login');
    await fillIn('[data-test-login-username] input', username);
    await fillIn('[data-test-login-password] input', password);
    await click('[data-test-login-button]');
    assert.equal(currentURL(), '/', "Successful login transfers to main route");
  });

  test('Log in with invalid credentials', async function (assert) {
    let username = 'justin';
    let password = 'nope!';
    await visit('/login');
    await fillIn('[data-test-login-username] input', username);
    await fillIn('[data-test-login-password] input', password);
    await click('[data-test-login-button]');

    const errorSelector = document.querySelectorAll('[data-test-login-errors] li').item(0);
    assert.equal(currentURL(), '/login', "Failed login stays on login route");
    assert.dom(errorSelector).includesText('Incorrect username or password');
  });

  test('Log in with missing field', async function (assert) {
    await visit('/login');

    const errors = () => {
      return document.querySelectorAll('[data-test-login-errors] li');
    };

    await fillIn('[data-test-login-username] input', '');
    await fillIn('[data-test-login-password] input', '');
    assert.dom(errors().item(0)).includesText("Username can't be blank");
    assert.dom(errors().item(1)).includesText("Password can't be blank");

    await fillIn('[data-test-login-username] input', 'justin');
    await fillIn('[data-test-login-password] input', '');
    assert.dom(errors().item(0)).includesText("Password can't be blank");

    await fillIn('[data-test-login-username] input', '');
    await fillIn('[data-test-login-password] input', 'test');
    assert.dom(errors().item(0)).includesText("Username can't be blank");

    await click('[data-test-login-button]');
    assert.equal(currentURL(), '/login', "Failed login stays on login route");
  });

});
