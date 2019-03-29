'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const EmberAppConfig = require('./config/environment');
const Constants = require('./config/constants');
const config = EmberAppConfig(EmberApp.env()); // eslint-disable-line
const fs = require('fs');
const Funnel = require('broccoli-funnel');
const stew = require('broccoli-stew');

const [isProd, isStaging, isDev, isTest] = // !! CAUTION WHEN EDITING !!
      [
        config.environment === "production",
        config.environment === "staging",
        config.environment === "development",
        config.environment === "test",
      ];

const isLocalProd = isProd && config.isLocalProd;
const isEs6Dev = isDev && config.isEs6Dev;

const knownEnvs = [
  "production",
  "staging",
  "development",
  "test",
];

const isKnownEnv = knownEnvs.includes(config.environment);
const isProdLike = isProd || isStaging || isLocalProd;
const showSourceMaps = isStaging || isDev || isTest;

(function ensureEnv() {
  const printEnv = () => `ENVIRONMENT is: ${config.environment.toUpperCase()}`;
  if (isLocalProd) {
    return `
    ---Running in !! local !! ${printEnv} mode ---
    `;
  }

  else if (!isLocalProd && isKnownEnv) {
    return `
    --- Running in ${printEnv} mode ---
    `;
  }

  else {
    throw Error('Running in unkown environment. Goodbye!');
  }
}());

const treeShakingIncludes = [
  'ember-test-selectors/utils/bind-data-test-attributes.js',
  'ember-validators/*.js'
];

if (config['ember-cli-mirage'] && config['ember-cli-mirage'].enabled) {
  treeShakingIncludes.push('ember-cli-mirage/utils/uuid.js');
}

module.exports = function(defaults) {

  let babelOptions = {};
  if (isEs6Dev) {
    babelOptions = {
      blacklist: [
        'regenerator',
      ]
    };
  }

  const buildConfig = {

    vendorFiles: {
      // 'jquery.js': null
      'app-shims.js': null
    },

    sassOptions: {
      includePaths: [
        'node_modules',
      ],
      sourceMap: true,
    },

    SRI: {
      enabled: false
    },

    'ember-cli-babel': {
      includePolyfill: false,
      // plugins: [],
      compileModules: true,
      disableDebugTooling: isProdLike ? 1 : 0,
      // disableEmberModulesAPIPolyfill: false,
      throwUnlessParallelizable: false,
    },

    babel: Object.assign({}, {
      modules: false,
      useBuiltIns: true,
      debug: true,
      plugins: [
        require('ember-auto-import/babel-plugin'),
        // require('babel-plugin-transform-object-rest-spread'), // de-opts atm
      ],
    }, babelOptions),

    autoprefixer: {
      browsers: ['last 1 versions']
    },

    fingerprint: {
      enabled: isProdLike,
      prepend: config.cloudfrontPrefix,
      generateAssetMap: true,
      extensions: Constants.FINGERPRINT_EXTENSIONS,
    },

    'ember-composable-helpers': {
      only: [],
    },

    svgJar: {
      // strategy: ['symbol', 'inline'],
      strategy: 'inline',

      // symbol: {
      //   sourceDirs: ['public/images/svg/symbols'], // symbols.svg
      //   stripPath: true,
      //   optimizer: false,
      //   includeLoader: true, // this will inject svg into the html, need to check perf of that, use inline with preload for now
      // },

      // inline seems the best, based on github article
      // https://blog.github.com/2016-02-22-delivering-octicons-with-svg/
      // more info on font icons vs svg icons
      // https://www.ianfeather.co.uk/ten-reasons-we-switched-from-an-icon-font-to-svg/
      // https://css-tricks.com/icon-fonts-vs-svg/
      inline: {
        sourceDirs: [
          'public/images/svg',
        ],
        stripPath: true,
        optimizer: {
          svgoModule: require('svgo'),

          plugins: [{
            removeTitle: true,
          }, {
            addClassesToSVGElement: {
              className: 'xui-icon',
            }
          }]
        },
        validations: {
          validateViewBox: false,
          checkForDuplicates: true,
        },
        // persist: false,
        // TODO: We want a whitelist, but the upstream addon
        // is rather complex. This is a 2 minute hack, that is **longer** to fix.
        //
        // Truth is, we should have a separate app that is hosted somewhere that
        // **makes** you download the svg icon and place it in public/images/svg/icons
        //
        // This would not catch icons that are not in use though, leading to
        // eventual bloat. Not 2600 svg's out of the box bloat, but 'some' bloat
        copypastaGen: (assetId) => `{{svg-jar "${assetId}"}}`,
        idGen: (path) => {
          if (fs.existsSync(`public/images/svg/icons/${path}.svg`) || fs.existsSync(`public/images/svg/custom/${path}.svg`)) {
            return `${path}`.replace(/[\s]/g, '-');
          } else {
            return `DEVELOPMENT-ONLY-${path}`.replace(/[\s]/g, '-');
          }
        }
      }
    },

    sassVariables: 'app/styles/variables.scss',

    sourcemaps: {
      enabled: showSourceMaps,
    },

    minifyCSS: {
      enabled: isProdLike,
      options: {
        persistentOutput: !isProdLike,
      }
    },

    minifyJS: {
      enabled: isProdLike,
      options: {
        mangle: true,
        compress: {
          // disable these have performance issues
          negate_iife: false,
        },
        output: {
          semicolons: false,
        },
      },
    },

    minifyHTML: {
      enabled: isProdLike,
      htmlFiles: ['index.html'],
      minifierOptions: {
        collapseWhitespace : true,
        removeComments     : true,
        minifyJS           : true,
        minifyCSS          : true,
      }
    },

    treeShaking: {
      enabled: false, // be careful with this one...
      include: treeShakingIncludes,
    },

    autoImport: {
      alias: {
        // when the app tries to import from "plotly.js", use
        // the real package "plotly.js-basic-dist" instead.
        // 'plotly.js': 'plotly.js-basic-dist',

        // you can also use alises to pick a different entrypoint
        // within the same package. This can come up when the default
        // entrypoint only works in Node, but there is also a browser
        // build available (and the author didn't provide a "browser"
        // field in package.json that would let us detect it
        // automatically).
      },
      forbidEval: true,
      // exclude: ['some-package'],
      // webpack: {
      //   // extra webpack configuration goes here
      // }
    }
  };

  // TODO: rename these directories via broccoli vendor tree in repo addon
  // svg jar in putting all svgs in vendor tree, even if the svg is in public/*
  if (!isProdLike) {
    buildConfig.svgJar.inline.sourceDirs.unshift('node_modules/@mdi/svg/svg');
    buildConfig.svgJar.inline.sourceDirs.unshift('vendor');
    buildConfig.svgJar.inline.sourceDirs.unshift('public/_dev-fixtures');
  }

  let app = new EmberApp(defaults, buildConfig);

  let appTree = app.toTree();

  // Place test/dev fixture assets in public/_dev-fixtures/*,
  // they will be removed during production builds.
  if (isProdLike) {
    appTree = new Funnel(appTree, {
      exclude: ['**/_dev-fixtures/**'],
    });
  }

  // DEBUG_BUILD=1 ember build [--prod] to see the broccoli appTree
  // in different environments. Very helpful for debugging purposes.
  if (process.env.DEBUG_BUILD) {
    return stew.log(appTree);
  } else {
    return appTree;
  }
};

