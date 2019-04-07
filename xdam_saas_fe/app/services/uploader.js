import Service from '@ember/service';
import { task } from 'ember-concurrency';
import { inject as service } from "@ember/service";
import ENV from 'xdam-saas-fe/config/environment';
import { computed }  from '@ember/object';

export default Service.extend({
  store: service(),
  ajax: service(),

  folderQueueDestinationElement: computed('folderQueueId', function() {
    const selector = this.get('folderQueueId');
    if (selector) {
      return document.getElementById(selector);
    } else {
      return;
    }
  }),

  _buildUrl({ folder, file }) {
    if (!folder || !folder.id || !file || !file.name) { throw Error('Must pass folder w/ id and file w/ name'); }
    return `${ENV.apiHost}/_ops/upload/folders/${folder.id}/assets?fileName=${file.name}`;
  },

  uploadImage: task(function * (file, folderId) {
    this.set('folderQueueId', `${folderId}`);


    // TODO: uncomment to test peekAll('assets') CP
    // const dataUrl = yield file.readAsDataURL();

    const folder = this.store.peekRecord('folder', folderId);
    // this.store.createRecord('asset', {
    //   folder,
    //   name: file.name,
    //   fileType: file.type,
    //   url: dataUrl, // tmp to test our bindings, which are totally broken
    // });

    try {
      let url = this._buildUrl({ folder, file });
      let signedUrl = yield this.ajax.request(url, { namespace: '' })
        .then((res) => res.signedRequest);
      return file.uploadBinary(signedUrl, { method: 'PUT', contentType: file.type });
    } catch (e) {
      this.logger.error(e);
    }
  }).maxConcurrency(3).enqueue(),

  actions: {
    uploadImage(folderId, file) {
      this.uploadImage.perform(file, folderId);
    },
  }
});
