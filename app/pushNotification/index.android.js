'use strict';

var ParseManagerAndroid = require('NativeModules').NotificationAndroidManager;

var app = require('./../libs/app');
var debug = require('./../libs/debug')('notifications');
var utils = require('./utils');

module.exports = {
  componentDidMount () {
    this.registerDevice();
  },
  componentWillUnmount () {
    // don't remove because of /app/navigation/LoggedIn.js:60
  },
  registerDevice() {
    ParseManagerAndroid.getParseInstallationObjectId((parseObjectId) => {
      if (!parseObjectId) {
        return debug.warn('registerDevice, no objectId found');
      }
      utils.registerDeviceOnDonut(parseObjectId);
    });
  },
  handleInitialNotification () {
    // @todo : yfuks implement app cold launch from notification
  }
};
