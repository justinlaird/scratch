import Component from '@ember/component';
import EmberObject, { computed } from '@ember/object';

// TODO: overhall me, somehow. Works but is not cutting it. Need
// active state for many buttons. We can extend the link component
// and use the right class names, and get that for free. That also
// separates a button that is ephermal in state, and one that is connected
// to the state of the router.

const ButtonComponent = Component.extend({
  tagName: 'button',
  classNames: ['xui-button'],

  classNameBindings: [
    'name',
    'mdcClassName',
    'mdcTopAppBarActionClasses',
    'mdcSideNavButtonClasses',
    'iconClasses',
    'selected'
  ],

  classNameBindingsMap: EmberObject.create({
    normal: 'mdc-button',
    blank: 'xui-button-blank',
    raised: 'mdc-button mdc-button--raised',
    unelevated: 'mdc-button mdc-button--unelevated',
    outlined: 'mdc-button mdc-button--outlined',
    dense: 'mdc-button mdc-button--dense',
    stroked: 'mdc-button mdc-button--stroked',
    icon: 'mdc-button mdc-button__icon material-icons',
    sideNav: 'mdc-button mdc-top-app-bar__navigation-icon',
  }),

  attributeBindings: [
    'title',
    'tabindex',
    'data-mdc-dialog-action',
    'type',
  ],

  name: null,
  variantType: 'normal',
  type: 'button',

  didInsertElement() {
    this._super(...arguments);
  },

  willDestroyElement() {
    this._super(...arguments);
  },

  mdcClassName: computed('variantType', 'menu', {
    get() {
      if (this.name === 'menu') { this.set('variantType', 'sideNav'); } // eslint-disable-line ember/no-side-effects
      return this.classNameBindingsMap[this.variantType];
    }
  }),

  iconClasses: computed('isIcon', {
    get() {
      if (this.isIcon) { return this.classNameBindingsMap.icon; }
    }
  }),

  click() {
    const click = this.onClick || this.onclick || this['on-click'] || this.action;
    if (click && click.call) {
      return click(...arguments);
    } else {
      this.logger.warn(`No custom click handler registered for the button with innerText set to: ${this.name}`);
    }
  }
});

ButtonComponent.reopenClass({
  positionalParams: ['name']
});

export default ButtonComponent;
