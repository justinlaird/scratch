import Component from '@ember/component';
import { attribute, classNames } from '@ember-decorators/component';

@classNames('mdc-list-divider')
export default class XuiMenuDividerComponent extends Component {
  @attribute('role')
  role = 'separator';
}
