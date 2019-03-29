import Component from '@ember/component';
import {
  tagName,
  classNames,
  attribute,
  className
} from '@ember-decorators/component';
import { service } from '@ember-decorators/service';
import { type, optional } from '@ember-decorators/argument/type';
import { argument } from '@ember-decorators/argument';
import { immutable } from '@ember-decorators/argument/validation';
import { ClosureAction } from '@ember-decorators/argument/types';

@tagName('li')
@classNames('xui-menu-item', 'mdc-list-item')
export default class XuiMenuItemComponent extends Component {
  @service
  media;

  @attribute('data-test-menu-item')
  dataTestMenuItem = true;

  @immutable
  @attribute('tabindex')
  tabindex = 0;

  /* ========= Begin Arguments ========= */

  @argument
  @type(optional('string'))
  @immutable
  icon;

  @argument
  @type(optional('string'))
  @immutable
  text;

  @argument
  @type('boolean')
  @className('xui-menu-item-disabled')
  disabled = false;

  @argument
  @type('boolean')
  @className('xui-hide')
  hidden = false;

  @argument
  @type(optional('string'))
  @immutable
  keyboard;

  @argument
  @type(ClosureAction)
  closeMenu;

  @argument
  @type(optional(ClosureAction))
  action;

  /* ========= End Arguments ========= */

  click() {
    if (this.action) {
      return this.action();
    } else {
      return this.closeMenu();
    }
  }
}
