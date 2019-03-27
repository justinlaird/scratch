const Hoek = require('hoek');
const { assert } = Hoek;

module.exports = class Base {
  constructor(cli) {
    assert(Object.keys(cli.options).length > 0, 'options is empty');
    assert(cli.constructor.name === "Cli", "cli must be an instance of the Cli class");
    this.cli = cli;
    this.logger = cli.logger;
    this.env = {};
  }
}
