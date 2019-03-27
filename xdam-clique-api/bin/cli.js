#!/usr/bin/env node

require('dotenv').config();

// process.env.BLUEBIRD_WARNINGS = 0;
const Cli = require('../lib');
const CliLogger = require('../lib/logger').CliLogger;
const Promise = require('bluebird');
const ChildProcess = require('child_process');

Promise.promisifyAll(ChildProcess);

process.on('warning', (warning) => {
  if (warning.message.indexOf('Promise.defer') > -1) { return; } // dont log bluebird Promise.defer warnings with a stack
  CliLogger.warn(warning);
  CliLogger.warn(`Warning -  name: ${warning.name}, message: ${warning.message}, stack: ${warning.stack}`);
});

process.on('uncaughtException', (err) => {
  CliLogger.error(err.message);
  CliLogger.error({ err }, 'uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  CliLogger.error(reason.message);
  CliLogger.error({ err: reason, json: promise }, 'unhandledRejection');
});

function beforeExit(code) {
  if (code > 0) {
    CliLogger.log('clique-cli Cli Completed with FAIL!');
  }
}

process.on('beforeExit', beforeExit);

Cli.run();
