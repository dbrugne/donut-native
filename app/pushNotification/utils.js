var currentUser = require('../models/current-user');

var debug = require('./../libs/debug')('pushNotification');

module.exports = {
  register (parseObjectId) {
    currentUser.registerDevice(parseObjectId, (err) => {
      if (err) {
        return debug.warn('registerDevice', err);
      }

      debug.log('Parse device registered', parseObjectId);
    });
  }
};
