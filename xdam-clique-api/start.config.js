'use strict';

const watch = './**/*.js';
const ignore_watch = ["coverage.html", "./config/*", "./lib/*", "./bin/*", module.filename, './.git/*'];

const defaultEnv = {
  "NODE_CONFIG_DIR": `${process.cwd()}/config/`,
  "NODE_CONFIG_STRICT_MODE": true
};

const defaultConfig = {
  "script": "./start.js",
  "exec_mode": "cluster",
  "max_memory_restart": "150M",
  "autorestart": true,
  "merge_logs": true,
  watch,
  ignore_watch,
  "instances": 1,
  instance_var: "INSTANCE_ID", // fixes node-config
  "env": defaultEnv,
};

const logConfig = {
  "log_file": "./logs/combined.outerr.log",
  "out_file": "./logs/out.log",
  "error_file": "./logs/err.log",
};

const prod = Object.assign({}, defaultConfig, {
  "name": "clique-api-production",
  trace: true,
  "watch": false,
  "env": Object.assign({}, {
    "NODE_ENV": "production",
  }, defaultEnv),
});

const dev = Object.assign({}, logConfig, defaultConfig, {
  "name": "clique-api-development",
  "env": Object.assign({}, {
    "NODE_ENV": "development",
  }, defaultEnv),
});

// @see xdam_sass_frontent/config/environment `setupEndpointHosts` function
const test = Object.assign({}, logConfig, defaultConfig, {
  "name": "clique-api-embertest",
  "env": Object.assign({}, {
    SERVER_PORT: 16007,
    INTERNAL_SERVER_PORT: 16007,
    DB_NAME: "cliquetest",
    DB_HOST: process.env.TEST_DB_HOST || process.env.DB_HOST,
    DB_USER: process.env.TEST_DB_USER || process.env.DB_USER,
    DB_PASSWORD: process.env.TEST_DB_PASSWORD || process.env.DB_PASSWORD,
    NODE_ENV: "test",
  }, defaultEnv),
});

module.exports = {
  apps: [prod, dev, test],
}
