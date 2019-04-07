import Component from '@ember/component';
import { MDCTopAppBar } from '@material/top-app-bar';

export default Component.extend({
  tagName: 'header',
  classNames: [
    'mdc-top-app-bar',
    'mdc-top-app-bar--dense',
    'xui-top-app-bar',
  ],

  didInsertElement() {
    this._super(...arguments);
    this.set('mdcComponent', new MDCTopAppBar(this.element));
  },

  willDestroyElement() {
    this.mdcComponent.destroy();
    this._super(...arguments);
  },

});
