'use strict';

var ParseManagerAndroid = require('NativeModules').NotificationAndroidManager;

var app = require('./../libs/app');
var debug = require('./../libs/debug')('notifications');
var utils = require('./utils');

module.exports = {
  componentDidMount () {
    this._registerDevice();
  },
  componentWillUnmount() {
    //don't remove because of /app/navigation/LoggedIn.js:60
  },
  _registerDevice() {
    ParseManagerAndroid.getString('deviceToken', (err, deviceToken) => {
      if (err) {
        return debug.warn(err);
      }
      utils.registerInstallation(deviceToken);
    });
  }
};
