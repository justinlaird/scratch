import ObjectProxy from '@ember/object/proxy';
import EmberObject from '@ember/object';

/* istanbul ignore next */
export default ObjectProxy.extend({
  init() {
    this._super(...arguments);
    this.content = EmberObject.create({});
  }
});
