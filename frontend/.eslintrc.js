module.exports = {
  'parserOptions': {
    'sourceType': 'module'
  },
  'env': {
    'es6': true,
    'node': false
  },
  'extends': [
    'eslint:recommended',
    'airbnb-base'
  ],
  // check if imports actually resolve
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': 'build/webpack.base.conf.js'
      }
    }
  },
  'rules': {
    'no-new': 0,
  },
};