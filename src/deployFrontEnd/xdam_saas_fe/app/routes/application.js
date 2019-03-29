import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import config from '../config/environment';
import { inject as service } from '@ember/service';

export default Route.extend(ApplicationRouteMixin, {
  appMain: service(),

  beforeModel(transition) {
    this._super(...arguments);

    if (!this.get('session.isAuthenticated')) {
      this._cacheTransition(transition);
      this.transitionTo('login'); // async-no-return
    }
  },

  sessionAuthenticated() {
    return this.appMain._setCurrentUser()
      .then(() => this.appMain.retryTransition());
  },

  sessionInvalidated() {
    window.location.replace(config.rootURL);
  },

  /**
   * Caches the transition on the session if it's empty.
   * @private
   * @method _cacheTransition
   */
  _cacheTransition(transition) {
    if (!this.get('session.attemptedTransition')) {
      this.set('session.attemptedTransition', transition.abort());
    }
  },

  /**
   * Handles application-level error catching.
   */
  _handleAppErrors(err) {
    if (!err) {
      return this.appMain.set('errorMessage', `
        This is embarrassing. You seem to have
        hit an unexpected error. Please reload. Error A1.
      `);
    }

    if (this.appMain.handleNetworkError(err)) {
      // Application level error redirecting.
      if (Array.isArray(err && err.errors)) { // should never hit this w/o json api
        for (let i = 0; i < err.errors.length; i++) {
          const _err = err && err.errors[i];
          if (!_err) {
            continue;
          }
          // Redirect 404's to the main page for now.
          if (Number(_err.status) === 404) {
            this.transitionTo(config.rootURL);
            break;
          }
        }
      }
      this.logger.error(err);
    }
  },

  actions: {
    retryTransition() {
      return this.appMain.retryTransition();
    },

    error() {
      this._handleAppErrors(...arguments);

      return true;
    },
  }
});
