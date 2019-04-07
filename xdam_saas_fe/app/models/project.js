import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  created: DS.attr('string'),
  modified: DS.attr('string'),
  rootFolder: DS.belongsTo('folder'),
  user: DS.belongsTo('user'),
  customer: DS.belongsTo('customer'),

  totalChildren: 0
});
