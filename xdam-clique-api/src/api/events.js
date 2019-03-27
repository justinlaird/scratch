'use strict';
const notificationManager = require('../../services/notification-manager');


module.exports = {
  version: process.env.npm_package_version,
  name: 'events',
  register: function (server/* , options */) {
    server.route({
      method: ['GET'],
      path: '/events',
      handler: function (request, h) {
        console.log("Subscribe request :");
        console.log(request.query);

        const sendEventData = (eventData) => {
          console.log(`Send event data: `);
          console.log(eventData);
          h.event(eventData);
        }

        notificationManager.subscribe(request.query.container);
        notificationManager.addListener(request.query.container, sendEventData);

        request.events.once('disconnect', () => {
          console.log(`---------------HAPI Request disconnect`);
          notificationManager.removeListener(request.query.container, sendEventData);
          notificationManager.unsubscribe(request.query.container);
        });


        const response = h.event({event: notificationManager.CONNECTED, data: notificationManager.CONNECTED});
        return response;
      },
    });
  }
};
