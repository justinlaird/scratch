const ChildProcess = require('child_process');
const Promise = require('bluebird');
const Util = require('util');
const lodash = require('lodash');
const Base = require('../base');
const Portfinder = require('portfinder');
const spawn = ChildProcess.spawn;
const exec = Util.promisify(ChildProcess.exec);

const { assign } = Object;

class Db extends Base {

  async setup() {
    this.timeoutInMinutes = .5; // wait for all mysql connections to close, and sequelize to stop logging via bunyan logger, time here is rough estimate / 6 (actual seems to be about 3 min, but until this is proven to fail tests, were ignoring this fact)
    this.env.DB_USER =     this.cli.options['db-user'];
    this.env.DB_PASSWORD = this.cli.options['db-password'];
    this.env.DB_HOST =     this.cli.options['db-host'];
    this.env.DB_NAME =     this.cli.options['db-name'];
    this.timeout = 1000 * 60 * this.timeoutInMinutes;

    this.logger.info(`
    ----
    MIGRATING DB:
      Name: "${this.env.DB_NAME}"
      Host: "${this.env.DB_HOST}"
    ----
    `)
  }

  async create() {
    this.serverPort = await Portfinder.getPortPromise();
    await this.setup();
    await this.createDb();
    await this._run(...arguments);
  }

  async recreate() {
    this.serverPort = await Portfinder.getPortPromise();
    await this.setup();
    await this._run(...arguments);
  }

  async createDb({ username=this.env.DB_USER, password=this.env.DB_PASSWORD, host=this.env.DB_HOST } = {}) {
    if (password !== '') { password = `-p'${password}'`; }
    const command = `mysql -h ${host} -u ${username} ${password} -e "CREATE DATABASE ${this.env.DB_NAME};"`;

    try {
      const { stdout/*, stderr*/ } = await exec(command);
      return stdout.trim();
    } catch (err) {
      this.logger.error("Error running mysql binary on this machine. Cannot create a new db. Goodbye. %o", err);
      process.exit(1);
    }
  }

  _run(commandName, args=[]) {
    return new Promise((resolve) => {
      const command = spawn(commandName, args, {
        env: assign({}, process.env, this.env, {
          SERVER_PORT: this.serverPort,
        }),
      });

      const debouncedKill = lodash.debounce(() => {
        process.stdout.write(`\nAll Finished!\n`);
        command.kill();
        resolve(command.stdin.end());
      }, this.timeout);

      const debouncedMsg = lodash.debounce((data) => {
        if (data.includes('store.populate')) {
          this.logger.info("\n\nPlease Wait, Do NOT exit the process\n");
        }
      }, 1000);

      command.stdout.on('data', (data) => {
        process.stdout.write(data);
        debouncedMsg(data);
        debouncedKill();
      });

      command.stderr.on('data', (data) => {
        process.stderr.write(data);
      });

      command.on('error', (err) => {
        const msg = `${commandName} ${args} failed`
        err.message = err.message ? `${msg} \n ${err.message}`: msg;
        process.stderr.write(err);
        this.logger.error({ err }, msg);
      });

      command.on('close', (code) => {
        if (code !== 0) {
          command.kill();
        }

        resolve(command.stdin.end());
      });
    });
  }
}

module.exports = Db;
