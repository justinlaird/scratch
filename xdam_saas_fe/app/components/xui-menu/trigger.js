import Component from '@ember/component';
import { classNames } from '@ember-decorators/component';
import { type } from '@ember-decorators/argument/type';
import { ClosureAction } from '@ember-decorators/argument/types';
import { argument } from '@ember-decorators/argument';
import { service } from '@ember-decorators/service';

@classNames('xui-cursor-pointer')
export default class XuiMenuTriggerComponent extends Component {
  @service
  media;

  @argument
  @type(ClosureAction)
  openMenu;

  @argument
  @type('string')
  eventType;

  handleTrigger(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    return this.openMenu(evt);
  }

  constructor(...args) {
    super(...args);
    const eventType = this.get('media.isTablet') ? 'click' : this.eventType;
    this.on(eventType, this.handleTrigger);
  }
}
