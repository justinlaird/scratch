import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { inject as service } from '@ember/service';

export default Route.extend(AuthenticatedRouteMixin, {
  currentUser: service(),
  appMain: service(),
  media: service(),
  layoutManager: service(),

  beforeModel() {
    if (!this.get('currentUser.id')) {
      return this.appMain._setCurrentUser({
        head: true
      });
    }
  },

  actions: {
    didTransition() {
      this.appMain.scrollTop(); // TODO: do we really want this behavior?

      // Make sure rail is closed when transitioning on mobile devices
      if (this.get('media.isTablet') && this.get('layoutManager.leftRail')) {
        this.get('layoutManager.leftRail').send('toggleRail', false);
      }

      return true; // allow bubbling
    }
  },
});
