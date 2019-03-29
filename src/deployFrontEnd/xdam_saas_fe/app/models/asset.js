import DS from 'ember-data';
import { computed }  from '@ember/object';

export default DS.Model.extend({
  name: DS.attr('string'),
  location: DS.attr('string'),
  fileType: DS.attr('string'),
  created: DS.attr('string'),
  modified: DS.attr('string'),
  success: DS.attr('boolean', { defaultValue: false }),
  url: DS.attr('string'),

  collections: DS.hasMany('collection', { inverse: null }),
  folder: DS.belongsTo('folder'),

  hasUrl: computed('location', 'name', 'success', 'url', {
    get() {
      return !!(this.location && this.name) ||
             !!(this.url && this.success === false); }
  }),
});
