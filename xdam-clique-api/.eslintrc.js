module.exports = {
  extends: [
    'eslint:recommended'
  ],
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'commonjs'
  },
  env: {
    'node': true
  },
  rules: {
    'no-console': 0
  },
  globals: {
    QUnit: true
  },
};
