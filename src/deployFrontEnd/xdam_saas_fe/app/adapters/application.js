import DS from 'ember-data';
import config from 'xdam-saas-fe/config/environment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import { isPresent } from '@ember/utils';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  authorize(xhr) {
    const token = this.get('session.data.authenticated.jwt');
    if (isPresent(token)) {
      xhr.setRequestHeader('Authorization', `${config.authTokenPrefix} ${token}`);
    }
  },
  coalesceFindRequests: true,
  namespace: config.namespace,
  host: config.apiHost,

  shouldReloadRecord(/*store, snapshot*/) {
    return false; // default
  },

  shouldBackgroundReloadRecord(/*store, snapshot*/) {
    return true; // default
  },

  /**
   * - By default this methods returns true if the passed snapshotRecordArray is
   *   empty (meaning that there are no records locally available yet),
   *   otherwise it returns false.
   *
   * - Note that, with default settings, shouldBackgroundReloadAll will always
   *   re-fetch all the records in the background even if shouldReloadAll returns
   *   false. You can override shouldBackgroundReloadAll if this does not suit
   *   your use case.
   */
  shouldReloadAll(/*store, snapshotRecordArray*/) {
    return false;
  },

  /**
   * - This method is only checked by the store when the store is returning a
   *   cached record.
   * - By default, this hook returns true so the data for the record is updated
   *   in the background.
   */
  shouldBackgroundReloadAll(/*store, snapshotRecordArray*/) {
    return true;
  },


});



