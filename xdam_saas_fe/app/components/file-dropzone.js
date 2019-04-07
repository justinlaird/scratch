/* global Blob, Uint8Array */
import Component from '@ember/component';

import { inject as service } from '@ember/service';
import { bind } from '@ember/runloop';
import { computed, set, get } from '@ember/object';
import DataTransfer from 'ember-file-upload/system/data-transfer';
import uuid from 'ember-file-upload/system/uuid';
import parseHTML from 'ember-file-upload/system/parse-html';
import DragListener from 'ember-file-upload/system/drag-listener';




const DATA_TRANSFER = 'DATA_TRANSFER' + uuid.short();

let supported = (function () {
  return typeof window !== 'undefined' && window.document &&
         'draggable' in document.createElement('span');
}());

const dragListener = new DragListener();

/**
  `{{file-dropzone}}` is an element that will allow users to upload files by
   drag and drop.

  ```hbs
  {{{#file-dropzone name="photos" as |dropzone queue|}}
    {{#if dropzone.active}}
      {{#if dropzone.valid}}
        Drop to upload
      {{else}}
        Invalid
      {{/if}}
    {{else if queue.files.length}}
      Uploading {{queue.files.length}} files. ({{queue.progress}}%)
    {{else}}
      <h4>Upload Images</h4>
      <p>
        {{#if dropzone.supported}}
          Drag and drop images onto this area to upload them or
        {{/if}}
        {{#file-upload name="photos"
                      accept="image/*"
                      multiple=true
                      onfileadd=(action "uploadImage")}}
          <a id="upload-image" tabindex=0>Add an Image.</a>
        {{/file-upload}}
      </p>
    {{/if}}
  {{/file-dropzone}}
  ```

  ```js
  import Controller from '@ember/controller';

  export default Ember.Route.extend({
    actions: {
      uploadImage(file) {
       file.upload(URL, options).then((response) => {
          ...
       });
      }
    }
  });
  ```

  @class FileDropzone
  @type Ember.Component
  @yield {Hash} dropzone
  @yield {boolean} dropzone.supported
  @yield {boolean} dropzone.active
  @yield {valid} dropzone.valid
  @yield {Queue} queue
 */
export default Component.extend({
  classNameBindings: [
    'valid',
    'invalid',
  ],

  tagName: 'xui-file-dropzone',

  /**
    The name of the queue that files should be
    added to when they get dropped.

    @argument name
    @type {string}
   */
  name: null,

  supported,

  /**
    `ondragenter` is called when a file has entered
    the dropzone.

    @argument ondragenter
    @type {function}
   */
  ondragenter() {
    // this.logger.info("ondragenter", ...arguments);
  },

  /**
    `ondragleave` is called when a file has left
    the dropzone.

    @argument ondragleave
    @type {function}
   */
  ondragleave() {
    // this.logger.info("ondragleave", ...arguments);
    this._hideOverlay();
  },

  /**
    `ondrop` is called when a file has been dropped.

    @argument ondrop
    @type {function}
   */
  ondrop() {
    // this.logger.info("ondrop", ...arguments);
    this._hideOverlay();
  },

  fileQueue: service(),

  /**
    Whether users can upload content
    from websites by dragging images from
    another webpage and dropping it into
    your app. The default is `false` to
    prevent cross-site scripting issues.

    @argument allowUploadsFromWebsites
    @type {boolean}
    @default false
   */
  allowUploadsFromWebsites: false,

  /**
    This is the type of cursor that should
    be shown when a drag event happens.

    Corresponds to `dropEffect`.

    This is one of the following:

    - `copy`
    - `move`
    - `link`

    @argument cursor
    @type {string}
    @default null
   */
  cursor: null,

  queue: computed('name', {
    get() {
      let queueName = get(this, 'name');
      let queues = get(this, 'fileQueue');
      return queues.find(queueName) ||
             queues.create(queueName);
    }
  }),

  didInsertElement() {
    this._super();

    dragListener.addEventListeners(`#${get(this, 'elementId')}`, {
      dragenter: bind(this, 'didEnterDropzone'),
      dragleave: bind(this, 'didLeaveDropzone'),
      dragover: bind(this, 'didDragOver'),
      drop: bind(this, 'didDrop')
    });
  },

  willDestroyElement() {
    dragListener.removeEventListeners(`#${get(this, 'elementId')}`);
  },

  isAllowed() {
    return get(this[DATA_TRANSFER], 'source') === 'os' ||
           get(this, 'allowUploadsFromWebsites');
  },

  didEnterDropzone(evt) {
    let dataTransfer = DataTransfer.create({
      queue: get(this, 'queue'),
      source: evt.source,
      dataTransfer: evt.dataTransfer,
      itemDetails: evt.itemDetails
    });
    this[DATA_TRANSFER] = dataTransfer;

    if (this.isAllowed()) {
      evt.dataTransfer.dropEffect = get(this, 'cursor');
      set(this, 'active', true);
      set(this, 'valid', get(dataTransfer, 'valid'));

      if (this.ondragenter) {
        this.ondragenter(dataTransfer);
      }
    }
  },

  didLeaveDropzone(evt) {
    set(this[DATA_TRANSFER], 'dataTransfer', evt.dataTransfer);
    if (this.isAllowed()) {
      if (evt.dataTransfer) {
        evt.dataTransfer.dropEffect = get(this, 'cursor');
      }
      if (this.ondragleave) {
        this.ondragleave(this[DATA_TRANSFER]);
        this[DATA_TRANSFER] = null;
      }

      set(this, 'active', false);
    }
  },

  didDragOver(evt) {
    set(this[DATA_TRANSFER], 'dataTransfer', evt.dataTransfer);
    if (this.isAllowed()) {
      evt.dataTransfer.dropEffect = get(this, 'cursor');
    }
  },

  async didDrop(evt) {
    set(this[DATA_TRANSFER], 'dataTransfer', evt.dataTransfer);

    if (!this.isAllowed()) {
      evt.dataTransfer.dropEffect = get(this, 'cursor');
      this[DATA_TRANSFER] = null;
      return;
    }

    // Testing support for dragging and dropping images
    // from other browser windows
    let url;

    let html = this[DATA_TRANSFER].getData('text/html');
    if (html) {
      let parsedHtml = parseHTML(html);
      let img = parsedHtml.getElementsByTagName('img')[0];
      if (img) {
        url = img.src;
      }
    }

    if (url == null) { // eslint-disable-line
      url = this[DATA_TRANSFER].getData('text/uri-list');
    }

    if (url) {
      var image = new Image();
      image.decoding = 'async';
      var [filename] = url.split('/').slice(-1);
      image.crossOrigin = 'anonymous';
      image.onload = () => {
        var canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;

        var ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);

        if (canvas.toBlob) {
          canvas.toBlob((blob) => {
            let [file] = get(this, 'queue')._addFiles([blob], 'web');
            set(file, 'name', filename);
          });
        } else {
          let binStr = atob(canvas.toDataURL().split(',')[1]);
          let len = binStr.length;
          let arr = new Uint8Array(len);

          for (var i=0; i<len; i++ ) {
            arr[i] = binStr.charCodeAt(i);
          }
          let blob = new Blob([arr], { type: 'image/png' });
          blob.name = filename;
          let [file] = get(this, 'queue')._addFiles([blob], 'web');
          set(file, 'name', filename);
        }
      };
      /* eslint-disable no-console */
      image.onerror = function (e) {
        console.log(e);
      };
      /* eslint-enable no-console */
      image.src = url;
    }

    if (this.ondrop) {
      this.ondrop(this[DATA_TRANSFER]);
    }

    // Add file(s) to upload queue.
    const files = get(this[DATA_TRANSFER], 'files');

    set(this, 'active', false);
    get(this, 'queue')._addFiles(files, 'drag-and-drop');
    this[DATA_TRANSFER] = null;
    // await this.ingest(files);
  },

  _hideOverlay() {
    this.set('valid', false);
  },
  /*
    Save original to indexdb. You must remove these as the upload that
    comes back succeeds, which is why its disabled atm.

    NOTE: ember-auto-load uses webpack to make another bundle, so unless you
    import the line shown below, the code that does this logic will not be shipped
    over the wire but can still be in your package.json.

    Usage:

    import ImgDb from "img-db";

    const {
      ImageRecord
    } = ImgDb;

    async ingest(files) {
      if (files.length === 0) {
        return;
      }
      for (const file of files) {
        const record = new ImageRecord();
        record.setOriginal(file);
        await record.save();
      }
    }

    then inside `didDrop` add:

    `await await this.ingest(files);` at the end of the function
  */
});
