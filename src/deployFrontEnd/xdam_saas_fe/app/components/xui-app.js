import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: '',

  appShell: service(),
  media: service(),
  layoutManager: service(),
  activeContainer: service(),

});
