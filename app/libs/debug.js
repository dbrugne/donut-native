var _ = require('underscore');

var namespaces = [
  'client',
//  'oauth',
  'navigation',
//  'storage',
//  'notifications',
//  'cloudinary'
];

module.exports = function (namespace) {
  // not logged namespaces
  if (namespaces.indexOf(namespace) === -1) {
    return {
      log: _.noop,
      warn: _.noop,
      error: _.noop
    };
  }

  return {
    log () {
      console.log.apply(console, arguments);
    },
    warn () {
      console.warn.apply(console, arguments);
    },
    error () {
      console.error.apply(console, arguments);
    }
  };
};
