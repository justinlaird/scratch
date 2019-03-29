import { inject as service } from '@ember/service';
import FreestyleController from 'ember-freestyle/controllers/freestyle';
import sassVariables from 'xdam-saas-fe/utils/sass-variables';

export default FreestyleController.extend({
  emberFreestyle: service(),
  overlayManager: service(),

  init() {
    this._super(...arguments);
    this.set('emberFreestyle.defaultTheme', 'atom-one-dark');

    this.colorPalette = Object.entries(sassVariables['$xui-colors'])
      .reduce((curr, [key, value]) => {
        curr[key] = { name: key, base: value.hex };
        return curr;
      }, {});
  },
});
