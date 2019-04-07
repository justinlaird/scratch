import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: '',

  uploader: service(),
  didReceiveAttrs() {
    this._super(...arguments);

    if (this.model && this.model.constructor && this.model.constructor.modelName === 'folder') {
      this.isFolder = true;
    }
  }
});
