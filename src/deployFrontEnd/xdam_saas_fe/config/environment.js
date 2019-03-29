'use strict';

require('dotenv').config();

// For future travelers - yes, ember-cli does run this file more than once,
// so yes, you will see duplicate log output, twice on a warm start, 4 times
// from a cold start.
const stubToken = (env) => {
  const expiresIn = '72h';

  const token = require('jsonwebtoken').sign({
    data: {
      userId: '32fb0105-acaa-4adb-9ec4-8b49633695e1'
    }
  }, 'SooperSeekrit', {
    expiresIn,
    algorithm: 'HS512'
  });

  if (env === 'test') {
    console.log("\nDO NOT RUN YOUR TESTS at /tests -- use `yarn run test` or `yarn run test:auto`\n"); // eslint-disable-line
  }

  return {
    userId: 'us5cca2e-0dd8-4b95-8cfc-a11230e73116',
    jwt: token,
    authenticator: 'test',
  };
};

const setupEndpointHosts = (ENV) => {
  //const DEFAULT_API_HOST = 'http://xdam-clique-api.xdamqa.com:16006';
  const DEFAULT_API_HOST = 'https://penqlqk7yl.execute-api.us-west-2.amazonaws.com/development';

  if (ENV.environment === 'test') {
    // Usage:
    //    `yarn run start:embertest`     (api terminal)
    //    `yarn run test:api:local:auto` (ember app terminal)
    //
    // or just `yarn test` for the default api host
    ENV.apiHost = process.env.TEST_API_HOST || DEFAULT_API_HOST;
    return;
  }

  if (ENV.environment === 'development') {
    // Usage:
    //    `yarn run start:api:local` (api terminal)
    //    `yarn run start:api:local` (ember app terminal)
    //
    // or just `yarn start` for default api
    ENV.apiHost = process.env.DEV_API_HOST || DEFAULT_API_HOST;
    return;
  }

  if (ENV.environment === 'production') {
    // USAGE:
    // To run production build with local api:
    //    `yarn run start:api:local`      (api terminal)
    //    `yarn run start:prod:api:local` (ember app terminal)
    //
    // or just `yarn run start:prod:local` for default api, with local production build
    //
    // Deploy: PLEASE DON'T DO THIS MANUALLY, UNLESS YOUR TESTING A NEW BOX
    //   `yarn run deploy:prod`
    //   OR w/ non default host
    //   `PROD_API_HOST='http://example.com:16006' yarn run deploy:prod`
    ENV.apiHost = process.env.PROD_API_HOST || DEFAULT_API_HOST;
    return;
  }

  else {
    throw Error('Missing branch to build app with an api host. Was a new environment added?');
  }
};

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'xdam-saas-fe',
    environment,
    rootURL: '/',
    namespace: 'rest',
    tokenNamespace: 'connect',
    authTokenPrefix: 'Bearer',
    locationType: 'auto',
    apiHost: null,
    cloudfrontPrefix: null,
    isLocalProd: process.env.IS_LOCAL_PROD === "1",
    isEs6Dev: true,
    exportApplicationGlobal: false,
    enableDeprecationWarnings: process.env.ENABLE_DEPRECATION_WARNINGS || false,
    npmPackageVersion: process.env.npm_package_version,
    '@ember-decorators/argument': {
      typeRequired: true, // NOTE: may break upstream addons, @see https://github.com/ember-decorators/argument/issues/29
      ignoreComponentsWithoutValidations: true,
    },
    contentSecurityPolicy: false,
    contentSecurityPolicyMeta: false,
    contentSecurityPolicyHeader: false,
    featureFlags: {

    },
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: false,
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    resizeServiceDefaults: {
      debounceTimeout    : 200,
      heightSensitive    : true,
      widthSensitive     : true,
      injectionFactories : [ 'view', 'component']
    }
  };

  if (environment === 'development') {
    if (process.env.LOUD_DEBUG) {
      // ENV.APP.LOG_RESOLVER = true;
      // ENV.APP.LOG_ACTIVE_GENERATION = true;
      ENV.APP.LOG_TRANSITIONS = true;
      ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
      // ENV.APP.LOG_VIEW_LOOKUPS = true;
      ENV.EmberENV.DEBUG_TASKS = true;
    }

    ENV['ember-cli-mirage'] = {
      enabled: false
    };

    setupEndpointHosts(ENV);
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';

    ENV['ember-simple-auth-token'] = {
      refreshAccessTokens: false,
      tokenExpirationInvalidateSession: false,
    };

    ENV.STUB_TOKEN = stubToken('test');

    ENV['ember-cli-mirage'] = {
      enabled: true,
      autostart: false
    };
    setupEndpointHosts(ENV);

    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    setupEndpointHosts(ENV);

    ENV.contentSecurityPolicy = {
      // Deny everything by default
      'default-src': "'none'",
      'script-src': ["'self'"],
      'font-src': ["'self'", "data:", "fonts.gstatic.com"],
      'connect-src': ["'self'",  "data:", "api.cliqueqa.com", "sls-clique-asset-pipeline-qa-assets-2.s3.us-west-2.amazonaws.com"],
      'img-src': ["'self'", "assets.cliqueqa.com", "s3.amazonaws.com", "data:", "blob:", "cliqueqa.com"], // TODO: remove s3.amazonaws.com from seed data
      'style-src': ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      'media-src': null
    };

    ENV.contentSecurityPolicyMeta = true;

    if (!ENV.isLocalProd) {
      ENV.cloudfrontPrefix = process.env.CLOUDFRONT_PREFIX || 'https://cliqueqa.com/';
    }

    // test csp locally, in prod build
    if (ENV.isLocalProd) {
      ENV.contentSecurityPolicy['connect-src'].push("api.clique.local");
    }
  }

  ENV['ember-simple-auth-token'] = {
    identificationField: 'username',
    tokenPropertyName: 'jwt',
    serverTokenEndpoint: `${ENV.apiHost}/${ENV.tokenNamespace}/token`,
    refreshAccessTokens: false,
    // serverTokenRefreshEndpoint: `${ENV.apiHost}/${ENV.tokenNamespace}/token-refresh`,
    // refreshLeeway: 2700,
    // timeFactor: 1000,
  };

  return ENV;
};
