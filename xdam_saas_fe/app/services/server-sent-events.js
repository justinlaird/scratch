import Service from '@ember/service';
import { inject as service } from '@ember/service';
import config from 'xdam-saas-fe/config/environment';
import { A }  from '@ember/array';
import Evented from '@ember/object/evented';
import { NativeEventSource, EventSourcePolyfill } from 'event-source-polyfill';

const EventSource = NativeEventSource || EventSourcePolyfill;

const constants = Object.freeze({
  CREATE_ASSET: 'createAsset',
  UPDATE_ASSET: 'updateAsset',
  CONNECTED: 'connected'
});

export default Service.extend(Evented, {
  eventSource: null,
  content: null,
  session: service(),

  init(){
    this._super(...arguments);
    this.set('content', A());
    Object.assign(this, constants);
  },

  handleEvent(e) {
    this.logger.debug('server-sent-events service  received event: %o', e);
    this.trigger('folderUpdate', e.data);
  },


  subscribe(containerId) {

    if (this.get('eventSource')){
      this.get('eventSource').close();
    }


    this.logger.debug(`Subscribe for container Id ${containerId}`);
    const _this = this;

    const tokenParam = encodeURIComponent(this.get('session.data.authenticated.jwt'));
    const containerParam = encodeURIComponent(containerId);
    const eventSource = new EventSource(`${config.apiHost}/events?container=${containerParam}&auth=${tokenParam}`);


    eventSource.addEventListener(containerId, (e) =>{
      _this.handleEvent(e);
    }, false);

    eventSource.addEventListener(this.CONNECTED, (e) =>{
      this.logger.debug('server-sent-events CONNECTED: %o', e);
    }, false);


    eventSource.addEventListener('error', (e) => {
      this.logger.debug('server-sent-events ERROR: %o', e);

      if (e.readyState === EventSource.CLOSED) {
        this.logger.debug('EVENTSOURCE CLOSED');
        //_this.handleError(e);
        return;
      }
    }, false);



    this.set('eventSource', eventSource);
  }

});

