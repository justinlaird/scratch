import Component from '@ember/component';
import { classNames, attribute, className } from '@ember-decorators/component';
import { type } from '@ember-decorators/argument/type';
import { argument } from '@ember-decorators/argument';
import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';

import styleString from 'xdam-saas-fe/utils/style-string';

@classNames('xui-card')
export default class XuiCard extends Component {
  @service
  media;

  @attribute('draggable')
  @argument
  @type('boolean')
  draggable = false;

  @className('xui-card--square')
  @argument
  @type('boolean')
  square = false;

  @className('xui-card--selected')
  @argument
  @type('boolean')
  selected = false;

  @argument
  @type('string')
  width = '25%';

  @argument
  @type('number')
  heightRatio = 1;

  @computed('heightRatio', 'width')
  get height() {
    const height = Number(this.get('width').slice(0, -1)) * this.get('heightRatio');
    return `${height.toFixed(2)}%`;
  }

  @attribute('style')
  @computed('size')
  get style() {
    return styleString(this.get('size'));
  }

  @computed('square', 'width', 'height')
  get size() {
    return {
      width: this.get('width'),
      'padding-top': this.get('square') === true ? this.get('height') : 'initial',
    };
  }
}
