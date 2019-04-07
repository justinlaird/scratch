import Component from '@ember/component';
import { service } from '@ember-decorators/service';
import { action, computed } from '@ember-decorators/object';

import { task } from 'xdam-saas-fe/utils/macros';

export default class XuiDialogNewFolderComponent extends Component {
  @service
  router;

  @service
  store;

  @service
  overlayManager;

  @computed('values.{recordType,parentType,parent}')
  get title() {
    if (this.values.parentType === 'user') {
      return 'New Personal Collection';
    } else {
      return `New ${this.values.recordType} within ${this.get('values.parent.name')}`;
    }
  }

  values = {
    recordName: null,
    recordType: null,
    parent: null,
    parentType: null,
  }

  @task(function * (parentId) {
    const parent = yield this.store.findRecord(this.values.parentType, parentId);
    this.set('values.parent', parent);
  })
  fetchParent;

  @task(function * () {
    const record = this.store.createRecord(this.values.recordType, {
      [this.values.parentType]: this.values.parent,
      name: this.values.recordName,
    });
    yield record.save();
  })
  createRecord;

  @action
  willOpen({ parentId, parentType, recordType }) {
    this.set('values.parentType', parentType);
    this.set('values.recordType', recordType);
    this.get('fetchParent').perform(parentId);
  }

  @action
  willClose({action}) {
    if (action === 'Create') {
      this.get('createRecord').perform(this.values);
    }
  }

  @action
  didClose() {
    this.set('values', this._originalValues);
  }

  constructor(...args) {
    super(...args);
    this.set('_originalValues', Object.assign({}, this.values));
  }
}
