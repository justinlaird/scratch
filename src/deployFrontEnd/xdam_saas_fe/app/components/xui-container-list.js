import Component from '@ember/component';
import TextField from '@ember/component/text-field';



TextField.reopen({
  attributeBindings: ['data-key']
});

export default Component.extend({
  tagName: 'xui-container-list',
  classNames: ['xui-container-list'],
});
