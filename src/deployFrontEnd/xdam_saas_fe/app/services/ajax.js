import AjaxService from 'ember-ajax/services/ajax';
import { inject as service } from '@ember/service';
import config from '../config/environment';
import { computed } from '@ember/object';

export default AjaxService.extend({

  session: service(),

  host: config.apiHost,
  namespace: config.namespace,
  contentType: 'application/json',

  headers: computed('session.data.authenticated.jwt', function () {
    const headers = {
      'Accept': 'application/json',
    };
    const token = this.get('session.data.authenticated.jwt');
    if (token) {
      headers.Authorization = `${config.authTokenPrefix} ${token}`;
    }
    return headers;
  }),

});
