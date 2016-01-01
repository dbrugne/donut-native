'use strict';

var ParseManagerAndroid = require('NativeModules').NotificationAndroidManager;

var app = require('./../libs/app');
var debug = require('./../libs/debug')('notifications');
var utils = require('./utils');

module.exports = {
  componentDidMount () {
    this.registerDevice();
  },
  componentWillUnmount() {
    // don't remove because of /app/navigation/LoggedIn.js:60
  },
  registerDevice() {
    ParseManagerAndroid.getId((parseObjectId) => {
      if (!parseObjectId) {
        return debug.warn('No objectId found for this device');
      }
      utils.register(parseObjectId);
    });
  }
};
