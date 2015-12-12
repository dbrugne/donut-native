var _ = require('underscore');
var debug = require('./debug')('system');

// default
var defaults = {
  parse: {
    url: 'https://api.parse.com/1/installations/',
    appId: 'HLZpzyuliql75EGfdH1o9En9VwDIp4h8KmRHaQ9g',
    masterKey: '7c6ycSLa7gBHzQ9w2KMJBKoVWrVwBw8606x7PtVA',
    restApiKey: 'cm5inOyCRXVRDAhQVsVvKgSmjvz7qJ9lwgm8niwk'
  }
};

// per-environment
var environments = {
  test: {
    facebook: {
      appId: '400694556754416'
    },
    ws: 'https://test.donut.me',
    oauth: 'https://test.donut.me/oauth/'
  },
  production: {
    ws: 'https://donut.me',
    oauth: 'https://donut.me/oauth/',
    facebook: {
      appId: '328569463966926'
    }
  }
};

var _config;
module.exports = function (nativeProps) {
  if (!_config) {
    if (!nativeProps) {
      throw new Error('libs/config.js need to be called with native props before');
    }
    if (!nativeProps.DONUT_ENVIRONMENT) {
      // @todo : uncomment when Android set nativeProps.DONUT_ENVIRONMENT
      nativeProps.DONUT_ENVIRONMENT = 'test';
//      throw new Error('libs/config.js native props should contains a DONUT_ENVIRONMENT key');
    }
    if (!environments[nativeProps.DONUT_ENVIRONMENT]) {
      throw new Error('libs/config.js unknown environment', nativeProps.DONUT_ENVIRONMENT);
    }
    // default, environment, nativeProps
    _config = _.extend(defaults, environments[nativeProps.DONUT_ENVIRONMENT], nativeProps);
  }
  return _config;
};
