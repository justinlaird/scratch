import Service from '@ember/service';
import { computed } from '@ember/object';
import { scheduleOnce }  from '@ember/runloop';
import { inject as service } from '@ember/service';


export default Service.extend({

  init() {
    this._super(...arguments);
    this.set('containerSettings', {});
  },


  activeContainerId: null,
  containerViewType: null,

  serverSentEvents: service(),

  isListView: computed('containerViewType', {
    get() {
      return 'list' === this.containerViewType;
    }
  }),

  isGridView: computed('containerViewType', {
    get() {
      return 'grid' === this.containerViewType;
    }
  }),

  setActiveContainerId: function(containerId) {
    const containerSettings = this.containerSettings;
    this.set('activeContainerId', containerId);

    //After all components have rendered, connect to SSE to being receiving events for this container
    scheduleOnce('afterRender', () => {
      this.serverSentEvents.subscribe(containerId);
    });

    if (containerSettings[containerId] && containerSettings[containerId].viewType){
      this.set('containerViewType', containerSettings[containerId].viewType);
    } else if (containerId) {
      this.set('containerViewType', 'grid');
    } else {
      this.set('containerViewType', null);
    }
  },

  actions: {
    setViewType(viewType) {
      if (this.activeContainerId) {
        this.containerSettings[this.activeContainerId] = {viewType: viewType};
        this.set('containerViewType', viewType);
      }
    },
  }

});
