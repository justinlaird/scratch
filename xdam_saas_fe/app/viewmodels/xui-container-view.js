import EmberObject from '@ember/object';
import { computed } from '@ember-decorators/object';
import { argument } from '@ember-decorators/argument';
import { type, optional, arrayOf } from '@ember-decorators/argument/type';
import { required } from '@ember-decorators/argument/validation';
import { filterBy } from '@ember-decorators/object/computed';

export class XuiContainerView extends EmberObject {

  @argument
  @type(optional('string'))
  containerType;

  @argument
  @type(optional(arrayOf('string')))
  childTypes;

  @type(optional(arrayOf('object')))
  _children;

  @type(optional('object'))
  _parentContainer;

  @type(optional('string'))
  _title;

  @computed('_children.[]', '_children')
  get children() {
    return this.get('_children');
  }
  set children(children) {
    const tableItems = children.map(model => XuiContainerViewItem.create({model: model}));
    this.set('_children', tableItems);
  }

  @computed('_children.[]', '_children')
  get folders() {
    const children = this.get('children');
    if (children){
      return this.get('children').filter(child => child.type === 'folder');
    } else {
      return null;
    }
  }

  @computed('_children.[]', '_children')
  get collections() {
    const children = this.get('children');
    if (children){
      return this.get('children').filter(child => child.type === 'collection');
    } else {
      return null;
    }
  }

  @filterBy('_children', 'type', 'asset')
  assets;

  @computed('_parentContainer')
  get item() {
    return this.get('_parentContainer');
  }
  set item(item) {
    this.set('_parentContainer', item);
  }

  @computed('_title')
  get title() {
    return this.get('_title');
  }
  set title(titleString) {
    this.set('_title', titleString);
  }

  addChild(modelObject){
    const newItem = XuiContainerViewItem.create({model: modelObject});
    this.get('_children').push(newItem);
  }
}

class XuiContainerViewItem extends EmberObject {

  @required
  @argument
  @type('object')
  model;

  @computed('model.hasUrl')
  get hasUrl() {
    return this.get('model.hasUrl');
  }

  @computed('model.created')
  get created() {
    return this.get('model').get('created');
  }

  @computed('model.modified')
  get modified() {
    return this.get('model').get('modified');
  }

  @computed('model.name')
  get name() {
    return this.get('model').get('name');
  }

  @computed('model')
  get type() {
    return this.get('model').get('constructor.modelName');
  }

  @computed('model')
  get hasRoute() {
    switch (this.get('type')) {
    case 'asset':
      return false;
    default:
      return true;
    }
  }

  @computed('model')
  get route() {
    switch (this.get('type')) {
    case 'project':
      return 'main.folders.show';
    case 'collection':
      return 'main.collections.show';
    default:
      return 'main.folders.show';
    }
  }

  @computed('model')
  get routeModel() {
    switch (this.get('type')) {
    case 'project':
      return this.get('model').get('rootFolder');
    default:
      return this.get('model');
    }
  }

  @computed('model.totalChildren')
  get totalChildren() {
    return this.get('model').get('totalChildren');
  }

}
