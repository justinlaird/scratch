import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  created: DS.attr('string'),
  modified: DS.attr('string'),

  users: DS.hasMany('user', { inverse: null }),
  collections: DS.hasMany('collection'),
  customer: DS.belongsTo('customer'),
});
