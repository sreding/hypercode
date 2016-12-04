module.exports = {
  'root': true,
  'env': {
    'node': true
  },
  'extends': [
    'eslint:recommended',
    'airbnb-base'
  ],
  'rules': {
    'indent': [
      'error',
      2
    ],
    'brace-style': [
      'error',
      'stroustrup'
    ],
    'no-console': 0,
  }
};