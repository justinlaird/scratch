import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

export default Helper.extend({
  router: service(),

  compute([routeName, ...params]) {
    return (...invocationArgs) => {
      const args = params.concat(invocationArgs);
      const transitionArgs = params.length ? [routeName, ...params] : [routeName];
      this.router.transitionTo(...transitionArgs);
      return args;
    };
  }
});
