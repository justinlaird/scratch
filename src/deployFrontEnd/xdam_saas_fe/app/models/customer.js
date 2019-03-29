import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  created: DS.attr('string'),
  modified: DS.attr('string'),

  users: DS.hasMany('user'),
  projects: DS.hasMany('projects'),
  groups: DS.hasMany('group'),
});
