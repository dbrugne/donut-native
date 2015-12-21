'use strict';
var _ = require('underscore');

module.exports = {
  merge : function(style, platformStyle) {
    let keys = _.union(_.keys(style), _.keys(platformStyle));
    let _styles = {};
    _.each(keys, (key) => _styles[key] = _.extend(style[key], platformStyle[key]));

    return _styles;
  }
};