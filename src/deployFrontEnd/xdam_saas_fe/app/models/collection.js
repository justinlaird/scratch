import DS from 'ember-data';
import { computed }  from '@ember/object';


export default DS.Model.extend({
  name: DS.attr('string'),
  created: DS.attr('string'),
  modified: DS.attr('string'),
  assets: DS.hasMany('asset'),
  folder: DS.belongsTo('folder', { inverse: 'collections' }),
  user: DS.belongsTo('user', { inverse: null }),

  totalChildren: computed('assets.[]', {
    get() {
      return this.assets.length;
    }
  })
});
