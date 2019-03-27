module.exports = function(options) {
  if (!options) {
    throw Error("Must pass options to require('config')(options)");
  }

  // TODO: maybe confirm that we actually want to re-seed here in production,
  // or if -e production is passed, don't allow re-seeding. Perhaps only
  // allow re-seeding of 'staging' or whatever we want to call our live but non
  // user facing api instance, that is used for e2e testing from the client.

  return options;
};
