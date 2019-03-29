import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { isBlank }  from '@ember/utils';
import { task, timeout } from 'ember-concurrency';
import { A }  from '@ember/array';
import moment from 'moment';
import { FilterOps } from  'xdam-saas-fe/utils/filters';

export default Component.extend({
  tagName: 'xui-container-view',

  currentUser: service(),
  store: service(),
  activeContainer: service(),
  serverSentEvents: service(),

  filters: null,

  init() {
    this.set('filters',{});
    this._super(...arguments);
  },


  didReceiveAttrs() {
    this.set('filters', {});
    if (this.model && this.model.containerId) {
      this.viewData.perform();
    }
  },

  didInsertElement() {
    this.serverSentEvents.on('folderUpdate', this, 'onFolderUpdate');
  },

  onFolderUpdate: function(eventData){
    this.logger.debug('Component xui-container-view received folderUpdate: %o', eventData);
    this.viewData.perform();
  },


  viewData: task (function * () {
    yield timeout(500);

    const containerType = this.model.get('containerType');
    const parentRelationship = this.model.get('parentRelationship');
    const containerId = this.model.get('containerId');
    const childTypes = this.model.get('childTypes');

    const filters = this.filters;
    const filterParams = {};

    if (parentRelationship){
      filterParams[parentRelationship] = containerId;
    } else {
      filterParams[containerType] = containerId;
    }

    Object.keys(filters).forEach(filterKey => {
      const filterText =  filters[filterKey];
      if ('created' === filterKey){
        let filterStartDate = moment(filterText).utc();
        let filterStartIsValid = filterStartDate.isValid();
        if (filterStartIsValid) {
          let filterTextStart = filterStartDate.format();
          let filterTextEnd = filterStartDate.add(moment.duration(24, 'hours')).format();
          this.logger.debug(`date filter text start ${filterTextStart} end ${filterTextEnd}`);
          filterParams[filterKey] = [`${FilterOps.lt}${filterTextEnd}`, `${FilterOps.gt}${filterTextStart}`];
          filterParams[FilterOps.bool]= {};
          filterParams[FilterOps.bool][filterKey] = FilterOps.and;
        }
      } else {
        filterParams[filterKey] = `${FilterOps.in}${filterText}`;
      }
    });

    const item = yield this.store.findRecord(containerType, containerId);
    let pageTitle = item.get('name');

    if ('folder' ===  containerType) {
      const parentProject = item.belongsTo('project').value();
      if (parentProject) {
        pageTitle = parentProject.get('name');
      }
    }

    this.model.set('item', item);
    this.model.set('title', pageTitle);


    const children = A();

    for (let i=0; i < childTypes.length ; i++ ) {
      const result = yield this.store.query(childTypes[i], { filter: filterParams } );
      children.addObjects(result);
    }

    this.model.set('children', children);

  }).restartable(),

  actions: {
    filterAction(filterText) {
      if (isBlank(filterText)) {
        this.logger.debug(`Filters key ${event.target.dataset.key}`);
        delete this.filters[event.target.dataset.key];
      } else {
        this.filters[event.target.dataset.key] = filterText;
      }
      this.viewData.perform();
    }
  }
});
