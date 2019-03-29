import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { classNames, className } from '@ember-decorators/component';
import { type } from '@ember-decorators/argument/type';
import { ClosureAction } from '@ember-decorators/argument/types';

@classNames('xui-rail-project-section')
export default class XuiRailProjectSectionComponent extends Component {
  symbol = Symbol('Section');

  @argument
  @type('boolean')
  @className('xui-rail-project-section-open')
  isOpen = false;

  @argument
  @type(ClosureAction)
  registerSection;

  constructor(...args) {
    super(...args);
    this.registerSection(this);
  }
}
