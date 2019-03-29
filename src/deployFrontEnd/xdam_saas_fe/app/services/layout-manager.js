import Service from '@ember/service';

export default Service.extend({
  registerRail(name, component) {
    this.set(name, component);
  },

  unregisterRail(name) {
    this.set(name, void 0);
  },

  actions: {
    toggleRail(name, open) {
      this.get(name).send('toggleRail', typeof open === 'boolean' ? open : null);
    }
  }
});
