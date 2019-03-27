'use strict';

require('dotenv').config();
const Glue = require('glue');

module.exports.init = async function(manifest, options) {
  try {
    const server = await Glue.compose(manifest, options);
    return server;
  } catch (err) {
    /* $lab:coverage:off$ */
    console.error(err); // eslint-disable-line no-console
    process.exit(1);
    /* $lab:coverage:on$ */
  }
};

/* $lab:coverage:off$ */
process.on('unhandledRejection', (err) => {

  console.error('unhandledRejection %o', err); // eslint-disable-line no-console
  process.exit(1);
});

process.on('uncaughtException', (err) => {

  console.error('uncaughtException: %o', err); // eslint-disable-line no-console
  process.exit(1);
});
/* $lab:coverage:on$ */
