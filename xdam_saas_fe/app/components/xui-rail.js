import Component from '@ember/component';
import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import { type, oneOf, arrayOf } from '@ember-decorators/argument/type';
import { argument } from '@ember-decorators/argument';
import { className, classNames, attribute } from '@ember-decorators/component';
import { filterBy, alias } from '@ember-decorators/object/computed';
import { raw } from 'ember-awesome-macros';
import { getOwner }  from '@ember/application';

import { findBy } from 'xdam-saas-fe/utils/macros';
import sassVariables from 'xdam-saas-fe/utils/sass-variables';

const RAIL_DIRECTIONS = ['left', 'right'];

@classNames('xui-rail')
export default class XuiLeftRail extends Component {
  @service
  layoutManager;

  @service
  media;

  @attribute('data-test-xui-rail')
  testXuiRail = true;

  /* =========== Begin Arguments =========== */

  @argument
  @type(arrayOf('object'))
  tabs;

  @argument
  @type(oneOf(...RAIL_DIRECTIONS))
  direction = 'left';

  /* =========== End Arguments =========== */

  /* =========== Begin Computed Props =========== */

  @className
  @computed('direction')
  get directionClassName() {
    return `xui-rail-${this.get('direction')}`;
  }

  @computed('open')
  get width() {
    // TODO: Width will eventually need to be dynamic
    const closedWidth = sassVariables['$xui-rail-width'] + sassVariables['$xui-rail-border-width'];
    const openWidth = closedWidth + sassVariables['$xui-rail-content-width'];
    return this.get('open') ? openWidth : closedWidth;
  }

  @computed('direction')
  get name() {
    return `${this.get('direction')}Rail`;
  }

  @className('xui-rail-open', 'xui-rail-closed')
  @computed('direction', 'mainController.{rightRail,leftRail}')
  get open() {
    return Boolean(this.get(`mainController.${this.get('name')}`));
  }

  @computed
  get mainController() {
    return getOwner(this).lookup('controller:main');
  }

  @findBy('tabs', raw('slug'), 'activeTabSlug')
  activeTab;

  @computed('mainController.{leftRailTab,rightRailTab}')
  get activeTabSlug() {
    return this.get(`mainController.${this.get('name')}Tab`);
  }

  @alias('activeTab.history.lastObject')
  activePanel;

  @filterBy('tabs', 'type', 'primary')
  primaryTabs;

  @filterBy('tabs', 'type', 'secondary')
  secondaryTabs;

  set bodyScroll(open) {
    if (this.get('media.isTablet')) document.querySelector('html').classList.toggle('xui-no-scroll', open);
  }

  /* =========== End Computed Props =========== */

  /* =========== Begin Actions =========== */

  @action
  toggleRail(open) {
    if (open) this.set(`mainController.${this.get('name')}`, open);
    else this.set(`mainController.${this.get('name')}`,  !this.get('open'));

    this.set('bodyScroll', this.get('open'));
  }

  @action
  renderTab(slug) {
    // If the slug provided is the already active tab, we'll close the rail instead of rendering
    if (this.get('activeTabSlug') === slug && this.get('open')) this.toggleRail(false);
    else this.toggleRail(true);

    this.set(`mainController.${this.get('name')}Tab`, slug);
  }

  @action
  lastPanel() {
    this.get('activeTab.history').popObject();
  }

  @action
  nextPanel(panelComponent) {
    this.get('activeTab.history').pushObject(panelComponent);
  }

  @action
  handleTabClick(tab) {
    if (tab.clickHandler && tab.clickHandler.call) {
      return tab.clickHandler(...arguments);
    } else {
      return this.send('renderTab', tab.slug);
    }
  }

  /* =========== End Actions =========== */

  /* =========== Begin Life Cycle Events =========== */

  constructor() {
    super(...arguments);
    this.get('layoutManager').registerRail(this.get('name'), this);
    this.set('bodyScroll', this.get('open'));
  }

  willDestroy() {
    this.get('layoutManager').unregisterRail(this.get('name'));
  }

  /* =========== End Life Cycle Events =========== */
}
