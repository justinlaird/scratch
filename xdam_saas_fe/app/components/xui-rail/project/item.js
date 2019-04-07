import Component from '@ember/component';
import { classNames } from '@ember-decorators/component';
import { service } from '@ember-decorators/service';
import { alias, or }  from '@ember-decorators/object/computed';
import { computed, action } from '@ember-decorators/object';
import { argument } from '@ember-decorators/argument';
import { type, optional } from '@ember-decorators/argument/type';

@classNames('mdc-list-item', 'xui-rail-list-item')
export default class XuiRailProjectItemComponent extends Component {
  @service
  intl;

  @argument
  @type(optional('object'))
  model;

  @or('model.folders.length', 'model.collections.length')
  hasSubItems;

  @alias('model.isOpenInRail')
  isOpenInRail = false;

  @computed('model')
  get menuItems() {
    return [{
      text: this.get('intl').t('xui-rail/project.options.share'),
      icon: 'share',
      action: () => this.logger.info('Sharing...'),
    }, {
      text: this.get('intl').t('xui-rail/project.options.create-approval'),
      icon: 'approval',
      action: () => this.logger.info('Archive...'),
    }, {
      text: this.get('intl').t('xui-rail/project.options.move-to'),
      icon: 'folder-move',
      action: () => this.logger.info('Download...'),
    }, {
      type: 'divider',
    }, {
      text: this.get('intl').t('xui-rail/project.options.download'),
      icon: 'download',
      action: () => this.logger.info('Download...'),
    }, {
      text: this.get('intl').t('xui-rail/project.options.upload'),
      icon: 'upload',
      action: () => this.logger.info('Upload...'),
    }, {
      type: 'divider',
    }, {
      text: this.get('intl').t('xui-rail/project.options.rename'),
      'icon': 'rename-box',
      action: () => this.logger.info('Rename...'),
    }, {
      text: this.get('intl').t('xui-rail/project.options.archive'),
      icon: 'archive',
      action: () => this.logger.info('Archive...'),
    }, {
      text: this.get('intl').t('xui-rail/project.options.delete'),
      icon: 'trash-can',
      action: () => {
        this.get('model').deleteRecord();
        this.get('model').save();
      }
    }];
  }

  @action
  toggle(state) {
    if (typeof state === 'boolean') return this.set('isOpenInRail', state);
    return this.toggleProperty('isOpenInRail');
  }
}
