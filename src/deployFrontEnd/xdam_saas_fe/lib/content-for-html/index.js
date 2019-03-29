/* eslint-env node */
'use strict';

module.exports = {
  name: 'content-for-html',

  included() {
    this._super.included.apply(this, arguments);
    this.app.options.storeConfigInMeta = false;
  },

  contentFor(type, config) {
    this._super.contentFor.apply(this, arguments);

    if (type === 'head') {
      return `
<link rel="preload" href="${config.rootURL}assets/vendor.js" as="script">
<link rel="preload" href="${config.rootURL}assets/${config.modulePrefix}.js" as="script">

<meta name="viewport" content="user-scalable=0, initial-scale=1, minimum-scale=1, width=device-width, height=device-height">

<link rel="stylesheet" href="${config.rootURL}assets/${config.modulePrefix}.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:400,700,900">
      `;
    }
  },
};
