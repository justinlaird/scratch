import Component from '@ember/component';
import { classNames, attribute } from '@ember-decorators/component';
import { type } from '@ember-decorators/argument/type';
import { argument } from '@ember-decorators/argument';
import { ClosureAction } from '@ember-decorators/argument/types';

@classNames('mdc-menu', 'mdc-menu-surface', 'xui-menu-surface', 'mdc-elevation--z5')
export default class XuiMenuMenuComponent extends Component {
  @argument
  @type(ClosureAction)
  closeMenu;

  @argument
  @type('string')
  eventType;

  @attribute('data-test-menu-surface')
  testMenuSurface = true;

  mouseLeave() {
    if (this.eventType === 'mouseEnter') {
      this.closeMenu();
    }
  }

  click() {
    return this.closeMenu();
  }
}
