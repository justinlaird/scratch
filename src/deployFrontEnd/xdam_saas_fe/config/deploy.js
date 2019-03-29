/* eslint-env node */
'use strict';

const Constants = require('./constants');

module.exports = function(deployTarget) {
  let ENV = {
    build: {

    }
    // include other plugin configuration that applies to all deploy targets here
  };

  const fingerprintFilePatterns = () => {
    return {
      filePattern: Constants.FINGERPRINT_FILE_PATTERN,
    };
  };

  const compressionFilePatterns = () => {
    return {
      filePattern: Constants.COMPRESSION_FILE_PATTERN,
    };
  };

  const awsCredentials = () => {
    return {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      region: process.env.AWS_REGION ||  'us-east-1',
    };
  };

  const s3Config = () => {
    return  Object.assign({}, awsCredentials(), {
      bucket: process.env.AWS_BUCKET ||  'xdam-clique-qa',
      allowOverwrite: true,
    });
  };

  //ember deploy production --activate --verbose
  //docker-compose -f docker-compose.yml -f devDeploy.yml up

  ENV["revision-data"] = Object.assign({}, fingerprintFilePatterns(), {
    type: 'file-hash',
    scm: null
  });

  ENV['s3-index'] = s3Config();

  ENV['s3'] = Object.assign({}, s3Config(), fingerprintFilePatterns());

  ENV['brotli'] = Object.assign({}, compressionFilePatterns(), {

  });

  ENV['manifest'] = Object.assign({}, fingerprintFilePatterns(), {

  });

  if (!process.env.CLOUDFRONT_DISTRIBUTION) {
    throw Error('You must provide a cloudfront distribution id as env var: CLOUDFRONT_DISTRIBUTION');
  }

  ENV.cloudfront = Object.assign({}, awsCredentials(), fingerprintFilePatterns(), {
    distribution: process.env.CLOUDFRONT_DISTRIBUTION,
  });

  if (deployTarget === 'development') {
    ENV.build.environment = 'development';
  }

  if (deployTarget === 'staging') {
    ENV.build.environment = 'production';
    // configure other plugins for staging deploy target here
  }

  if (deployTarget === 'production') {
    ENV.build.environment = 'production';
    // configure other plugins for production deploy target here
  }

  // Note: if you need to build some configuration asynchronously, you can return
  // a promise that resolves with the ENV object instead of returning the
  // ENV object synchronously.
  return ENV;
};
