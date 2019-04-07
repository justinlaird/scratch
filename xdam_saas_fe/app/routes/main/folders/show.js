import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { XuiContainerView } from 'xdam-saas-fe/viewmodels/xui-container-view';
export default Route.extend({
  store: service(),
  activeContainer: service(),

  // TODO: we must fix this, @see git log routes/main.js ~4 months ago
  model(params) {
    return XuiContainerView.create({
      containerId: params.folder_id,
      containerType: 'folder',
      childTypes: ['folder', 'collection', 'asset'],
    }); // TODO: this need to return an rsvp hash of data
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
