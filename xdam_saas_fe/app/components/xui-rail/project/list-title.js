import Component from '@ember/component';
import { classNames } from '@ember-decorators/component';
import { type } from '@ember-decorators/argument/type';
import { argument } from '@ember-decorators/argument';
import { ClosureAction } from '@ember-decorators/argument/types';

@classNames('mdc-list-item', 'xui-rail-list-item', 'xui-rail-project-list-title')
export default class XuiRailProjectSectionTitleComponent extends Component {
  @argument
  @type(ClosureAction)
  toggleSection;

  @argument
  @type('symbol')
  sectionSymbol;

  click() {
    return this.toggleSection(this.sectionSymbol);
  }
}
