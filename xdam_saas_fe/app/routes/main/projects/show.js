import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';


export default Route.extend({
  store: service(),

  async model(params) {
    return this.store.findRecord('project', params.project_id);
  }

});
