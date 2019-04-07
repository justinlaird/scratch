import Component from '@ember/component';
import { MDCTextField } from '@material/textfield';
import { argument } from '@ember-decorators/argument';
import { type, optional } from '@ember-decorators/argument/type';
import { ClosureAction } from '@ember-decorators/argument/types';
import { classNames, className } from '@ember-decorators/component';
import { notEmpty } from '@ember-decorators/object/computed';

@classNames('xui-field', 'mdc-text-field')
export default class XuiField extends Component {
  @className('mdc-text-field--dense')
  @argument
  @type('boolean')
  dense = true;

  @className('mdc-text-field--fullwidth')
  @argument
  @type('boolean')
  fullWidth = false;

  @className('mdc-text-field--outlined')
  @argument
  @type('boolean')
  outlined = false;

  @className('mdc-text-field--disabled')
  @argument
  @type('boolean')
  disabled = false;

  @argument
  @type('number')
  tabindex = 0;

  @argument
  @type(optional('string'))
  icon;

  @argument
  @type('string')
  type = 'text';

  @argument
  @type(optional('string'))
  label;

  @argument
  @type(optional('string'))
  placeholder;

  @argument
  @type(optional('string'))
  value;

  @argument
  @type(optional(ClosureAction))
  handleKeyDown;

  @className('mdc-text-field--with-leading-icon')
  @notEmpty('icon')
  hasIcon;

  didInsertElement() {
    this._super(...arguments);
    this._mdcComponent = this._mdcComponent || new MDCTextField(this.element);
  }

  willDestroyElement() {
    this._mdcComponent && this._mdcComponent.destroy();
    this._super(...arguments);
  }
}
