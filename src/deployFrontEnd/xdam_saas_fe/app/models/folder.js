import DS from 'ember-data';
import { computed }  from '@ember/object';

export default DS.Model.extend({
  name: DS.attr('string'),
  created: DS.attr('string'),
  modified: DS.attr('string'),

  assets: DS.hasMany('asset'),
  folders: DS.hasMany('folder', { inverse: 'folder' }),
  folder: DS.belongsTo('folder', { inverse: 'folders' }),
  project: DS.belongsTo('project', { inverse: 'rootFolder' }),
  collections: DS.hasMany('collection'),

  totalChildren: computed('folders.[]', {
    get() {
      return this.folders.length;
    }
  })
});
