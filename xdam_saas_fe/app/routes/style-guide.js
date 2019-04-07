import Route from '@ember/routing/route';

export default class FreestyleRoute extends Route {
  model(){
    return {
      menuItems: [{
        text: 'Item One',
        type: 'link',
        keyboard: '⌘⇧M',
        disabled: true,
        to: '/',
      }, {
        text: 'Item Two',
        type: 'link',
        icon: 'home',
        to: '/',
      }, {
        type: 'divider',
      }, {
        text: 'Item Three',
        type: 'link',
        to: '/',
      }, {
        text: 'Item Four',
        type: 'link',
        to: '/',
        hidden: true,
      }, {
        text: 'Item Five',
        type: 'link',
        to: '/',
      }, {
        text: 'Item Six',
        type: 'link',
        to: '/',
      }]
    };
  }
}
