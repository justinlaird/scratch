import Route from '@ember/routing/route';
import playground from './-playground-base';
import { inject as service } from "@ember/service";

export default Route.extend({
  media: service(),
  model() {
    const count = this.get('media.isMobile') ? 3 : 10;
    const list = playground.generate({ count });
    return playground.data(list);
  },
});
