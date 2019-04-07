import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { type } from '@ember-decorators/argument/type';

export default class XuiRailUsers extends Component {
  @argument
  @type('object')
  railActions;
}
