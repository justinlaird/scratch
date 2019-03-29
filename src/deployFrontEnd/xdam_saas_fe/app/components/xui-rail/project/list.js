import Component from '@ember/component';
import { classNames, attribute } from '@ember-decorators/component';

@classNames('mdc-list')
export default class XuiRailProjectSectionListComponent extends Component {
  @attribute('aria-orientation')
  ariaOrientation = true;
}
