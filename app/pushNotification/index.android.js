'use strict';

var ParseManagerAndroid = require('NativeModules').NotificationAndroidManager;
var ParsePushNotification = require('NativeModules').ParsePushNotification;
var {
    DeviceEventEmitter
  } = require('react-native');
var navigation = require('../navigation/index');

var app = require('./../libs/app');
var debug = require('./../libs/debug')('notifications');
var utils = require('./utils');

module.exports = {
  componentDidMount () {
    this.registerDevice();
    DeviceEventEmitter.addListener('remoteNotificationOpen', (e: Event) => {
      this.goToNotificationCenter(e);
    });
  },
  componentWillUnmount () {
    DeviceEventEmitter.removeAllListeners('remoteNotificationOpen');
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
    ParsePushNotification.popInitialNotification((err, notification) => {
      if (err) {
        return debug.warn('Android popInitialNotification error =>', err);
      }
      if (notification) {
        this.goToNotificationCenter(notification);
      }
    });
  },
  goToNotificationCenter (e: Event) {
    debug.log('Android notification opened =>', e);
    navigation.navigate('Notifications');
  }
};
