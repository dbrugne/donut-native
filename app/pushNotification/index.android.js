'use strict';

var React = require('react-native');
var {
  DeviceEventEmitter
} = React;

var ParseManagerAndroid = require('NativeModules').NotificationAndroidManager;
var ParsePushNotification = require('NativeModules').ParsePushNotification;
var navigation = require('../navigation/index');
var utils = require('./utils');
var debug = require('./../libs/debug')('pushNotification');

var PushNotification = React.createClass({
  componentDidMount () {
    this._registerDevice();
    DeviceEventEmitter.addListener('remoteNotificationOpen', (e) => {
      this._goToNotificationCenter(e);
    });
  },
  componentWillUnmount () {
    DeviceEventEmitter.removeAllListeners('remoteNotificationOpen');
  },
  render () {
    return null;
  },
  _registerDevice () {
    ParseManagerAndroid.getParseInstallationObjectId((parseObjectId) => {
      if (!parseObjectId) {
        return debug.warn('_registerDevice, no objectId found');
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
        this._goToNotificationCenter(notification);
      }
    });
  },
  _goToNotificationCenter () {
    navigation.navigate('Notifications');
  }
});

module.exports = PushNotification;
