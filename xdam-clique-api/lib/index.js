require('dotenv').config();

const Db = require('./db');
const CliDefinition = require('./cli-definition');
const Bossy = require('bossy');
const _ = require('lodash');
const Promise = require('bluebird'); // eslint-disable-line
const CliLogger = require('./logger').CliLogger;

const ui = {
  write() {
    return console.log(...arguments); // eslint-disable-line
  },
  writeError() {
    return console.error(...arguments); // eslint-disable-line
  }
}

class Cli {
  /**
   * Command: `db`
   *
   * Usage:
   *   clique-cli db <task> [options]
   *
   * @return {Object} Object containing methods that map to the tasks available
   *                  for this command
   */
  get db() {
    return {
      async recreate() {
        await this._db.recreate('node', ['lib/db/create-db.js']);
      },

      async create() {
        await this._db.create('node', ['lib/db/create-db.js']);
      },
    };
  }

  /**
   * Main entry point method called by ./bin/cli executable
   *
   * This takes the CliDefinition, parses the cli command, task and options,
   * then maps the appropriate task to its corresponding method for the command.
   *
   * tl;dr - commands are top level getter's and their tasks are the methods
   * within this [psuedo] namespace.
   *
   * @return {[type]} [description]
   */
  static run() {
    const options = Bossy.parse(CliDefinition);

    if (options instanceof Error) {
      ui.writeError(`\n${options.message}`);
      ui.write(Bossy.usage(CliDefinition, 'clique-cli <command> <task> [options]'));
      throw options;
    }

    const instance = Reflect.construct(this, [options]); // eslint-disable-line

    let command = options._ && options._[0];
    let task = options._ && options._[1];
    const isOptionHelp = options.h || options.help;
    const isCommandHelp = !command || command === 'help';
    const isTaskHelp = !task || task === 'help';
    command = _.camelCase(command);
    task = _.camelCase(task);

    instance.commands = Reflect.ownKeys(Object.getPrototypeOf(instance)) // eslint-disable-line
      .filter(prop => !instance[prop].call);

    instance.tasks = _.flatten(instance.commands
      .filter(key => key.length > 1)
      .map(command => Reflect.ownKeys(instance[command]))); // eslint-disable-line

    const helpOutput = () => {
      const msg = `
clique-cli <command> <task> [options]

Available commands:

${instance.commands.toString()}

Available tasks:

${instance.tasks.toString()}
      `;
      process.stdout.write(Bossy.usage(CliDefinition, msg));
      process.exit(1);
    }

    if (isOptionHelp) {
      helpOutput();
    }

    if (isCommandHelp || !(instance[command] && !instance[command].call)) {
      helpOutput();
    }

    if (isTaskHelp || !(instance[command][task] && instance[command][task].call)) {
      helpOutput();
    }

    instance.options = Object.assign(require('./config')(options), options);
    instance.logger = CliLogger;

    Object.assign(instance, {
      _db: new Db(instance),
    });
    return instance[command][task].call(instance);
  }
}

module.exports = Cli;
