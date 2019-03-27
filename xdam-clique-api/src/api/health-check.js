'use strict';

module.exports = {
  version: process.env.npm_package_version,
  name: 'health-check',
  register: function (server/* , options */) {
    server.route({
      method: 'GET',
      path: '/health-check',
      handler: () => 'ok 2',
      options: {
        auth: false
      },
    });
  }
};
