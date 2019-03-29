import Route from '@ember/routing/route';

export default Route.extend({
  //Do not repeat this pattern for other routes, this is a tool only used in development mode.  It causes the entire DOM tree to be re-rendered
  activate() {
    this._super(...arguments);
    document.body.classList.add("playground");
  },
  deactivate() {
    this._super(...arguments);
    document.body.classList.remove("playground");
  },

  model() {
    return [
      {
        name: 'Home',
        to: 'main.index',
      },
      {
        name: 'Playground',
        to: 'playground.index',
      },
      {
        name: 'Drawer',
        to: 'playground.drawer'
      },
      {
        name: 'Drawer New',
        to: 'playground.drawer-new'
      },
      {
        name: 'Accordion',
        to: 'playground.accordion'
      },
      {
        name: 'Cards',
        to: 'playground.cards'
      },
      {
        name: 'Grid',
        to: 'playground.grid'
      },
    ];
  },
});

