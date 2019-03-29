import Component from '@ember/component';

export default Component.extend({
  classNames: [
    'xui-content',
    'mdc-drawer-app-content', // used by top-app-bar to add an event listener
  ],
});
