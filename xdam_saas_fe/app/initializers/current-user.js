import CurrentUser from 'xdam-saas-fe/current-user';

export function initialize(application) {
  application.register('service:current-user', CurrentUser, {
    instantiate: true,
    singleton: true,
  });
}

export default {
  name: 'current-user',
  initialize
};
