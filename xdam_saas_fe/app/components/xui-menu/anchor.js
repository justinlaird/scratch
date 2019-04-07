import Component from '@ember/component';
import { ClosureAction } from '@ember-decorators/argument/types';
import { type } from '@ember-decorators/argument/type';
import { argument } from '@ember-decorators/argument';
import { className } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';

export default class XuiMenuAnchorComponent extends Component {
  @className('mdc-menu-surface--anchor')
  @computed('eventType')
  get isAnchor() {
    return this.eventType !== 'contextMenu';
  }

  @argument
  @type(ClosureAction)
  closeMenu;

  @argument
  @type('string')
  eventType;

  @argument
  @type('boolean')
  initialized;
}
