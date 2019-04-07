import Application from '@ember/application';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';
import { on } from 'rsvp';

/* istanbul ignore next */
on('error', (reason = {}, label = '') => {
  const now = Date.now();
  reason = reason.message || 'Unhandled Promise Error thrown w/o reason';

  if (reason !== 'TransitionAborted') {
    console.error(now, reason, label); // eslint-disable-line
  }
});

/* istanbul ignore next */
if (config.environment !== 'test') {
  window.onerror = ( /*msg, url, lineNo, columnNo, error*/ ...rest) => {
    console.error(...rest); // eslint-disable-line
    return false;
  };
}

/* istanbul ignore next */
const App = Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});

/* istanbul ignore next */
loadInitializers(App, config.modulePrefix);

export default App;
