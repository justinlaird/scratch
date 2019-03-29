/**
 * Please note, this component integrates the "dialog" material component using "The Advanced Approach: Using foundations and adapters."
 * @see {@link https://github.com/material-components/material-components-web/blob/25fe44671595ca6d0d958152a74c290dca602007/docs/integrating-into-frameworks.md#the-advanced-approach-using-foundations-and-adapters}
 *
 * Also note, links are provided where "MDCDialog" patters are mirrored (shortened links point to "MDCDialog").
 * @see {@link https://github.com/material-components/material-components-web/blob/25fe44671595ca6d0d958152a74c290dca602007/packages/mdc-dialog/index.js}
 */

import Component from '@ember/component';

import { service } from '@ember-decorators/service';
import { argument } from '@ember-decorators/argument';
import { ClosureAction } from '@ember-decorators/argument/types';
import { classNames, attribute } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { type, optional, arrayOf, shapeOf } from '@ember-decorators/argument/type';
import { required } from '@ember-decorators/argument/validation';

import { MDCDialogFoundation } from '@material/dialog';
import { closest, matches } from '@material/dom/ponyfill';
import * as util from '@material/dialog/util';
import createFocusTrap from 'focus-trap';

const strings = MDCDialogFoundation.strings;

@classNames('xui-dialog', 'mdc-dialog')
export default class XuiDialogComponent extends Component {
  @service
  overlayManager;

  @attribute('role')
  role = 'alertdialog';

  @attribute('aria-modal')
  ariaModal = 'true';

  @attribute('aria-labelledby')
  ariaLabelledBy = 'xui-dialog-title';

  @attribute('aria-describedby')
  ariaDescribedBy = 'xui-dialog-content';

  /* ============== Begin Arguments ============== */

  @argument
  @required
  @type('string')
  slug;

  @argument
  @type('string')
  initialFocusSelector = '.mdc-dialog__button--default';

  @argument
  @type(optional('string'))
  title;

  @argument
  @type(optional(arrayOf(shapeOf({
    name: 'string',
    onClick: optional(ClosureAction),
    default: 'boolean',
  }))))
  buttons;

  @argument
  @type(optional(ClosureAction))
  willOpen = () => null;

  @argument
  @type(optional(ClosureAction))
  didOpen = () => null;

  @argument
  @type(optional(ClosureAction))
  willClose = () => null;

  @argument
  @type(optional(ClosureAction))
  didClose = () => null;

  /* ============== End Arguments ============== */

  /* ============== Begin Computed Props ============== */

  @computed('_mdcFoundation')
  get isOpen() {
    return this._mdcFoundation.isOpen();
  }

  /* ============== End Computed Props ============== */

  /* ============== Begin Component Foundation ============== */

  @type(MDCDialogFoundation)
  _mdcFoundation = new MDCDialogFoundation({
    // NOTE: Consider using @className the following class methods. Need to determine how to
    // set classes with names such as 'mdc-component--prop'
    addClass: (className) => this.element.classList.add(className),
    removeClass: (className) => this.element.classList.remove(className),
    hasClass: (className) => this.element.classList.contains(className),
    addBodyClass: (className) => document.body.classList.add(className),
    removeBodyClass: (className) => document.body.classList.remove(className),
    eventTargetMatches: (target, selector) => matches(target, selector),
    computeBoundingRect: () => this.element.getBoundingClientRect(),
    trapFocus: () => this._focusTrap.activate(),
    releaseFocus: () => this._focusTrap.deactivate(),
    isContentScrollable: () => !!this._content && util.isScrollable(this._content),
    areButtonsStacked: () => util.areTopsMisaligned(this._buttons),
    getActionFromEvent: (event) => {
      const element = closest(event.target, `[${strings.ACTION_ATTRIBUTE}]`);
      return element && element.getAttribute(strings.ACTION_ATTRIBUTE);
    },
    clickDefaultButton: () => {
      if (this._defaultButton) {
        this._defaultButton.click();
      }
    },
    reverseButtons: () => {
      this._buttons.reverse();
      this._buttons.forEach((button) => button.parentElement.appendChild(button));
    },
    notifyOpening: () => this.trigger(strings.OPENING_EVENT, {}),
    notifyOpened: () => {
      this.trigger(strings.OPENED_EVENT, {});
      this.didOpen();
    },
    notifyClosing: (action) => this.trigger(strings.CLOSING_EVENT, action ? {action} : {}),
    notifyClosed: (action) => {
      this.trigger(strings.CLOSED_EVENT, action ? {action} : {});
      this.didClose(action ? {action} : {});
    },
  });

  /* ============== End Component Foundation ============== */

  /* ============== Begin Methods & Actions ============== */

  _open(...args) {
    this.willOpen(...args);
    this._mdcFoundation.open();
  }

  _close({ action }) {
    this._mdcFoundation.close(typeof action === 'string' ? {action} : {});
  }

  @action
  toggle(...args) {
    this.isOpen ? this._close(...args) : this._open(...args);
  }

  /* ============== End Methods & Actions ============== */

  /* ============== Begin Event Handling ============== */

  click(evt) {
    return this._handleInteraction(evt);
  }

  keyDown(evt) {
    return this._handleInteraction(evt);
  }

  /* ============== End Event Handling ============== */

  /* ============== Begin Life Cycle Hooks ============== */

  didInsertElement() {
    this._super(...arguments);

    // Reflecting @material/dialog 'initialize' method
    this._mdcContainer = this.element.querySelector(strings.CONTAINER_SELECTOR);
    this._buttons = [].slice.call(this.element.querySelectorAll(strings.BUTTON_SELECTOR));
    this._defaultButton = this.element.querySelector(strings.DEFAULT_BUTTON_SELECTOR);
    this._initialFocusEl = this.element.querySelector(this.initialFocusSelector);
    this._focusTrapFactory = createFocusTrap;

    // Reflecting @material/dialog 'getDefaultFoundation' method
    this._mdcFoundation.init();

    // Reflecting @material/dialog 'initialSyncWithDOM' method
    this._focusTrap = util.createFocusTrapInstance(this._mdcContainer, this._focusTrapFactory, this._initialFocusEl);
    this._handleInteraction = this._mdcFoundation.handleInteraction.bind(this._mdcFoundation);
    this._handleDocumentKeydown = this._mdcFoundation.handleDocumentKeydown.bind(this._mdcFoundation);
    this._updateLayout = () => this._mdcFoundation.layout();

    this._handleOpening = () => {
      this.get('resizeService').on('debouncedDidResize', () => this._updateLayout());
      document.addEventListener('keydown', this._handleDocumentKeydown);
    };

    this._handleClosing = (action) => {
      this.willClose(action);
      this.get('resizeService').off('debouncedDidResize', () => this._updateLayout());
      document.removeEventListener('keydown', this._handleDocumentKeydown);
    };

    this.on(strings.OPENING_EVENT, this, this._handleOpening);
    this.on(strings.CLOSING_EVENT, this, this._handleClosing);
  }

  willDestroyElement() {
    this.get('overlayManager').unRegisterOverlay(this.slug);

    // Reflecting @material/dialog 'destroy' method
    this.off('click', this, this._handleInteraction);
    this.off('keydown', this, this._handleInteraction);
    this.off(strings.OPENING_EVENT, this, this._handleOpening);
    this.off(strings.CLOSING_EVENT, this, this._handleClosing);
    this._handleClosing();

    this._mdcFoundation.destroy();

    this._super(...arguments);
  }

  constructor() {
    super(...arguments);
    this.get('overlayManager').registerOverlay(this, this.slug);
  }

  /* ============== End Life Cycle Hooks ============== */
}
