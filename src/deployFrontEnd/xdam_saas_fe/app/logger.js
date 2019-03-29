import config from 'xdam-saas-fe/config/environment';
import EmberObject from '@ember/object';

/* istanbul ignore next */
const runInDebug = (callback) => {
  if (config.environment === 'development') {
    return callback();
  } else {
    return;
  }
};


export default EmberObject.extend({
  error() {
    /* istanbul ignore next */
    return console.error(...arguments); // eslint-disable-line
  },
  warn() {
    /* istanbul ignore next */
    return console.warn(...arguments); // eslint-disable-line
  },
  info() {
    /* istanbul ignore next */
    return runInDebug(() => console.info(...arguments)); // eslint-disable-line
  },
  debug() {
    /* istanbul ignore next */
    return runInDebug(() => console.debug(...arguments)); // eslint-disable-line
  },
  log() {
    /* istanbul ignore next */
    return runInDebug(() => console.log(...arguments)); // eslint-disable-line
  },
});
