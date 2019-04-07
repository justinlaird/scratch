import RSVP from 'rsvp';
import Component from '@ember/component';
import { service } from '@ember-decorators/service';
import { action, computed } from '@ember-decorators/object';
import { classNames } from '@ember-decorators/component';
import { argument } from '@ember-decorators/argument';
import { type } from '@ember-decorators/argument/type';
import { waitForProperty } from 'ember-concurrency';
import { getOwner }  from '@ember/application';

import { taskDrop } from 'xdam-saas-fe/utils/macros';
import { alias } from '@ember-decorators/object/computed';

// Navigator Service, re-written, as a component, RED FLAG - recall craft shop component
@classNames('xui-rail-project', 'mdc-list-group')
export default class XuiRailProjectComponent extends Component {
  @service
  store;

  @service
  currentUser;

  @service
  router;

  @service
  media;

  @service
  overlayManager;

  @argument
  @type('object')
  railActions;

  @computed
  get mainController() {
    return getOwner(this).lookup('controller:main');
  }

  @alias('mainController.activeProject')
  activeProject;

  sections = [];

  @action
  registerSection(section) {
    this.sections.push(section);
  }

  @action
  toggleSection(sectionSymbol) {
    this.sections.forEach(section => {
      section.symbol === sectionSymbol ?
        section.toggleProperty('isOpen') :
        section.set('isOpen', false);
    });
  }

  @action
  drillInto(item, subitem) {
    this.get('directory').perform(item.constructor.modelName, item.id)
      .then((record) => { subitem.set('isOpenInRail', true); });
  }

  @action
  drillBack() {
    // Figure out who the current parent belongsTo
    const parent = this.get('directory.last.value');
    let parentBelongsTo = this.store.modelFor(parent.constructor.modelName).relationshipNames.belongsTo;

    RSVP.all(parentBelongsTo.map(o => parent.belongsTo(o).load()))
      .then(results => results.filter(result => result !== null))
      .then(([target]) => this.get('directory').perform(target.constructor.modelName, target.id));
  }

  @taskDrop(function * (recordType, recordId) {
    let record = yield this.store.peekRecord(recordType, recordId);
    if (!record) {
      record = yield this.store.query(type, {
        include: 'collections,folders.folders,folders.collections',
        fields: { folders: 'name', collections: 'name' },
        filter: { id: recordId },
        page: { limit: 15 },
      });
    }
    return record;
  })
  directory;

  constructor() {
    super(...arguments);
    waitForProperty(this.get('activeProject.last'), 'isFinished', true)
      .then(() => waitForProperty(this.get('activeProject.lastSuccessful.value.rootFolder'), 'isLoaded', true))
      .then(() => this.get('directory').perform('folder', this.get('activeProject.lastSuccessful.value.rootFolder.id')));
  }
}
