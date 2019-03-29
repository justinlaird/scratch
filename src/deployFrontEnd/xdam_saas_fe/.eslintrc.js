module.exports = {
  globals: {},
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
  },
  plugins: [
    'ember',
    // 'prettier',
  ],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended',
    // 'plugin:ember-suave/recommended', // https://github.com/DockYard/eslint-plugin-ember-suave/blob/master/config/base.js + https://github.com/DockYard/eslint-plugin-ember-suave/blob/master/config/recommended.js
    // 'prettier',
  ],
  env: {
    browser: true
  },
  rules: {
    semi: ['error', 'always'],
    'ember/no-jquery': 'error',
    // 'prettier/prettier': 'error',
    'no-unused-vars': ['error', {
      'args': 'none',
    }],
    'no-cond-assign': ['error', 'except-parens'],
    'eqeqeq': 'error',
    'no-eval': 'error',
    'new-cap': ['error', {
      'capIsNew': false,
      'capIsNewExceptions': ['A']
    }],
    'no-caller': 'error',
    'no-irregular-whitespace': 'error',
    'no-undef': 'error',
    'no-eq-null': 'error',
    'eol-last': 0,
    'indent': ['error', 2],
    // 'comma-style': 0,
    // 'comma-dangle': 0,
    // 'max-statements-per-line': ['error', { 'max': 4 }],
    // 'brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
  },
  overrides: [
    // node files
    {
      files: [
        '.eslintrc.js',
        '.template-lintrc.js',
        'ember-cli-build.js',
        'testem.js',
        'blueprints/*/index.js',
        'config/**/*.js',
        'lib/*/index.js',
      ],
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2015
      },
      env: {
        browser: false,
        node: true,
        es6: true,
      },
      plugins: ['node'],
      rules: Object.assign({}, require('eslint-plugin-node').configs.recommended.rules, {
        'node/no-unpublished-require': 0,
        'node/no-extraneous-require': 0
      })
    }
  ]
};

