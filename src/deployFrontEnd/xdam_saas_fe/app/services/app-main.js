import { computed } from '@ember/object';
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import config from 'xdam-saas-fe/config/environment';
import { set }  from '@ember/object';

export default Service.extend({
  init() {
    this._super(...arguments);

    this.DEFAULT_ERROR_MESSAGE =
       `An unknown error has occured, try refreshing your browser`;
    this.DS_ADAPTER_ERROR_MESSAGE =
      `There was a network connection error. Ensure your online and try again.`;
  },

  session: service(),
  router: service(),
  store: service(),
  currentUser: service(),

  routeIfAlreadyAuthenticated: 'main',
  routeAfterAuthentication: 'main',

  /* NOTE: using multiline template strings for errorz increases KB over the wire
  b/c we can minify a string with newlines, so go over the 80 char limit if
  its an error or warning, which are not stripped in production */
  handleNetworkError(err) {
    if (!err) {
      return this._handleFatalError(this.DEFAULT_ERROR_MESSAGE);
    }

    const isNetworkError =
      err.isAdapterError || // ED error, could be non network
      err.message && err.message.indexOf('ajax operation was aborted') > -1; // ember ajax AbortError
    if (isNetworkError) {
      this.set('errorMessage', [this.DS_ADAPTER_ERROR_MESSAGE, err]);
      return true;
    }
  },

  errorMessage: computed({
    set(_, _val) {
      return this._handleFatalError(_val);
    }
  }),

  _handleFatalError(_val) {
    const [msg, err] = Array.isArray(_val) ? [..._val] : [_val];
    this.logger.error(msg, err);
    // const val = htmlSafe(msg);
    // this.notify('alert', val, { closeAfter: 5000 });
    return false;
  },

  /**
   * Retries a cached transition.
   *
   * Checks if a transition was stored on the ember-simple-auth session
   * and if so it retries it while resetting the attemptedTransition.
   * @public
   * @method retryTransition
  */
  retryTransition() {
    const attemptedTransition = this.get('session.attemptedTransition');
    const previousUrl = this.previousUrl;
    if (attemptedTransition) {
      this.set('session.attemptedTransition', null);
      if (attemptedTransition.targetName === 'login') {
        return this.router.transitionTo(this.routeAfterAuthentication);
      } else {
        return attemptedTransition.retry();
      }
    } else if (previousUrl) {
      this.set('previousUrl', null);
      return this.router.transitionTo(previousUrl);
    } else {
      return this.router.transitionTo(config.rootURL);
    }
  },

  /**
  Use an ObjectProxy to set the current user.
  Bind save method to the underlying prototype of customer and user as the proxy
  only proxies data to the content property on the proxy, it contains no methods.
  */
  _setCurrentUser({ mainLevel=true } = {}) {
    const attemptedTransition = this.get('session.attemptedTransition');
    if (attemptedTransition) {
      mainLevel = false;
    }
    let include = !mainLevel ? { include: 'customer,collections' } :
      { include: 'customer.projects.rootFolder,collections,groups.collections' };
    return this.store.findRecord('user', this.get('session.data.authenticated.userId'), include)
      .then(user => {
        this.currentUser.save = user.save.bind(user);
        // TODO: firstObject b/c server GET uses a filter query, so we get an
        // array for toOne relationships
        const customer = this.store.peekAll('customer').firstObject;
        set(this.currentUser, 'content', user);
        set(this.currentUser, 'customer', customer);
        this.currentUser.content.customer.save = customer.save.bind(customer);
      });
  },

  isBrowser() {
    return (typeof window !== 'undefined') && window && (typeof document !== 'undefined') && document;
  },

  scrollTop() {
    if (this.isBrowser()) {
      window.scrollTo(0,0);
    }
  },
});
