
const Boom = require('boom');
const JsonWebToken = require('jsonwebtoken');
const NodeConfig = require('config');
const jwtSecret = NodeConfig.get('jwt.secret');


const scheme = function (/* server, options */) {
  return {
    authenticate: function (request, h) {

      const req = request.raw.req;
      const authorization = req.headers.authorization;
      if (!authorization) {
        throw Boom.unauthorized('Missing credentials', ['default-scheme']);
      }

      const jwtToken = authorization.replace('Bearer ', '');

      try {
        JsonWebToken.verify(jwtToken, jwtSecret);
      } catch (err) {
        throw Boom.unauthorized('Invalid credentials', ['default-scheme']);
      }

      const credentials = JsonWebToken.decode(jwtToken);
      return h.authenticated({ credentials: credentials.data });
    }
  };
};

module.exports = {
  version: process.env.npm_package_version,
  name: 'authorization',
  register: function (server, { disable=false } = {}) {
    if (disable === true) { return; } // disabled until auth is moved out of middleware, much more secure when we do

    server.auth.scheme('custom', scheme);
    server.auth.strategy('default', 'custom');
    server.auth.default('default');
  }
};
