import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';

export default Route.extend(UnauthenticatedRouteMixin, {
  appMain: service(),

  routeIfAlreadyAuthenticated: computed({
    get() { return this.appMain.routeIfAlreadyAuthenticated; }
  }),
  routeAfterAuthentication: computed({
    get() { return this.appMain.routeIfAlreadyAuthenticated; }
  }),
});
