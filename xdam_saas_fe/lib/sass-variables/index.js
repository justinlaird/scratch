/* eslint-env node */
'use strict';

const fs = require('fs');
const filendir = require('filendir');
const sassExtract = require('sass-extract');

module.exports = {
  name: 'sass-variables',

  isDevelopingAddon() {
    return true;
  },

  included(app) {
    this.app = app;

    if (typeof app.import !== 'function' && app.app) {
      this.app = app = app.app;
    }

    this._super.included.apply(this, arguments);
    this.appDir = this.app.options.appDir || 'app';
    this.variablesFile = this.app.options.sassVariables || null;
  },

  postBuild(result) {
    if (this.variablesFile) {
      let outputPath = this.appDir + '/utils/sass-variables.js';
      let outputFile = null;

      if (!fs.readFileSync(this.variablesFile, 'utf8')) {
        return console.warn('Please configure the `sassVariables: \'styles/_variables.scss\'` object in ember-cli-build.js`'); // eslint-disable-line no-console
      }

      const sassVariables = sassExtract.renderSync({ file: this.variablesFile }, { plugins: ['compact'] });
      let utilObject = `// DON'T UPDATE THIS FILE MANUALLY, IT IS AUTO-GENERATED.\nexport default JSON.parse(\`${JSON.stringify(sassVariables.vars.global, null, 2)}\`);\n`;

      try {
        outputFile = fs.readFileSync(outputPath, 'utf8');
      } catch(err) {
        console.error(err); // eslint-disable-line no-console
      }

      if (outputFile !== utilObject) {
        console.log('ember-cli-sass-variables'); // eslint-disable-line no-console
        filendir.writeFileSync(outputPath, utilObject, 'utf8');
      }
    }
    return result;
  }
};
