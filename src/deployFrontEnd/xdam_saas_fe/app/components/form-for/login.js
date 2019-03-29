import Component from '@ember/component';
import LoginValidations from 'xdam-saas-fe/validations/login';
import EmberObject from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  session: service(),

  LoginValidations,

  user: EmberObject.extend({
    username: null,
    password: null,
  }),

  actions: {
    /*
    TODO: Server error message is generic enough that it doesn't justify
    overriding ember-ajax to get the error message for this one off, non ember
    data use case. If more arrive, we can handle that in normalizeErrorResponse
    within the ajax service.
    */
    submitLogin(changeset) {
      const credentials = changeset._bareChanges;
      const errors = [{ validation: ['Incorrect username or password'] }];
      return this.session.authenticate('authenticator:token', credentials)
        .catch(() => changeset.set('_errors', errors));
    },
  },
});
