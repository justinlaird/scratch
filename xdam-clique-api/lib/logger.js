const Bunyan = require('bunyan');
const Path = require('path');
const Mkdirp = require('mkdirp');

const internals = {
  logDir: 'logs',
};

internals.logPath = function({ name }) {
  Mkdirp.sync(Path.resolve(__dirname, `../${internals.logDir}`));
  return Path.resolve(__dirname, `../${internals.logDir}/${name}.log`);
};

internals.streams = function({ /* name,  */level }) {
  const streams = [
    {
      type: 'rotating-file',
      period: '1d',
      count: 10, // default
      path: internals.logPath(...arguments),
      level,
    }
  ];

  return streams;
};

function sqlLogger() {
  const isEnabled = process.env.VERBOSE_SQL_LOGGING === '1'
  if (isEnabled) {
    const Logger = Bunyan.createLogger({
      name: 'clique-sql',
      streams: internals.streams({ name: 'clique-sql', level: 'trace' }),
      src: true,
    });

    return Logger.trace.bind(Logger, ...arguments);
  }

  return function() {};
}

module.exports = {
  CliLogger: console,
  sqlLogger,
};
