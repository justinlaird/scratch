import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  keyForAttribute(key) {
    return key;
  },

  // Allow camleCased relationship names on models to be sent over the wire
  // Normally ember expects dasherized keys, and convertes them to camel case
  keyForRelationship(key) {
    return key;
  }
});
