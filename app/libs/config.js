var _ = require('underscore');
var debug = require('./debug')('system');
var packageJson = require('../../package');

// default
var defaults = {
};

// build time
var buildTime = {
  DONUT_JS_VERSION: packageJson.version
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
      throw new Error('libs/config.js native props should contains a DONUT_ENVIRONMENT key');
    }
    if (!environments[nativeProps.DONUT_ENVIRONMENT]) {
      throw new Error('libs/config.js unknown environment', nativeProps.DONUT_ENVIRONMENT);
    }
    // default, buildTime, environment, nativeProps
    _config = _.extend(defaults, buildTime, environments[nativeProps.DONUT_ENVIRONMENT], nativeProps);
    debug.log('loaded config', _config);
  }
  return _config;
};
