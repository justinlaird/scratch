const Redis = require('ioredis');
const EventEmitter = require('events');
const config  = require('config');

const constants = Object.freeze({
  CREATE_ASSET: 'createAsset',
  UPDATE_ASSET: 'updateAsset',
  CONNECTED: 'connected'
});

class NotificatonManager extends EventEmitter {

  constructor(){
    super();
    Object.assign(this, constants);
    const redis_address = config.get('redis.redisAddress');
    if (redis_address) {
      this.redisPub = new Redis(redis_address);
      this.redisSub = new Redis(redis_address);
      this.redisActive = true;
    }
  }

  subscribe (containerId){
    console.log(`NotificatonManager subscribed for containerid ${containerId}`);
    console.log(`NotificatonManager.listenerCount(${containerId}) = ${this.listenerCount(containerId)}`);
    if (this.redisActive){
      this.redisSub.subscribe(containerId);
      this.redisSub.on('message',  (containerId, message) => {
        console.log('NotificatonManager receive message %s from channel %s', message, containerId);
        this.emit(containerId, {data: message, event: containerId});
      });
    }
  }

  publish(containerId, event){
    if (this.redisActive){
      console.log(`REDIS PUB ${containerId} ${event}`);
      this.redisPub.publish(containerId, event);
    } else {
      this.emit(containerId, {data: event, event: containerId});
    }
  }

  unsubscribe(containerId){
    if (this.redisActive){
      this.redisSub.unsubscribe(containerId);
    }
  }
}

module.exports = new NotificatonManager();
