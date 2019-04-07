import Logger from 'xdam-saas-fe/logger';

export function initialize(application) {
  application.register('logger:main', Logger, {
    instantiate: true, singleton: true
  });

  [
    'service',
    'route',
    'component',
    'controller',
    'model',
    'serializer',
    'adapter',
  ].forEach(type => {
    application.inject(type, 'logger', 'logger:main');
  });
}

export default {
  name: 'logger',
  initialize
};
