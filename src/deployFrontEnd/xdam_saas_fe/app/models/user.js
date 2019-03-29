import DS from 'ember-data';
import { computed }  from '@ember/object';

export default DS.Model.extend({
  firstname: DS.attr('string'),
  lastname: DS.attr('string'),
  email: DS.attr('string'),
  login: DS.attr('string'),
  password: DS.attr('string'),
  created: DS.attr('string'),
  modified: DS.attr('string'),

  collections: DS.hasMany('collection'),
  groups: DS.hasMany('group'),
  customer: DS.belongsTo('customer'),

  fullName: computed('firstname', 'lastname', {
    get() {
      return `${this.firstname} ${this.lastname}`;
    }
  }),
});
