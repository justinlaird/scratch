import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { XuiContainerView } from 'xdam-saas-fe/viewmodels/xui-container-view';

export default Route.extend({
  store: service(),
  activeContainer: service(),

  model(params) {
    return XuiContainerView.create({
      containerId: params.collection_id,
      containerType: 'collection',
      parentRelationship: 'collections',
      childTypes: ['asset'],
    });
  },

  actions: {
    didTransition() {
      this.activeContainer.setActiveContainerId(this.context.containerId);
      return true; // Bubble the didTransition event
    },
    willTransition(transition) {
      this.activeContainer.setActiveContainerId(null);
      return true; // Bubble the willTransition event
    }
  }
});
