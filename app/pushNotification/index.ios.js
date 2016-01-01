'use strict';

var React = require('react-native');
var {
  AlertIOS,
  PushNotificationIOS
} = React;

var utils = require('./utils');

var DonutParse = require('react-native').NativeModules.DonutParse;

var debug = require('./../libs/debug')('pushNotification');

module.exports = {
  componentDidMount () {
    PushNotificationIOS.addEventListener('register', this.onRegister.bind(this));
    PushNotificationIOS.addEventListener('notification', this.onNotification.bind(this));

    this.checkPermissions(); // @debug
    this.requestPermissions();
  },
  componentWillUnmount () {
    PushNotificationIOS.removeEventListener('register', this.onRegister.bind(this));
    PushNotificationIOS.removeEventListener('notification', this.onNotification.bind(this));
  },
  onRegister (deviceToken) {
    debug.log('onRegister', deviceToken);
    DonutParse.getParseInstallationId((err, objectId) => {
      if (err) {
        debug.warn(err);
      }
      utils.register(objectId);
    });
  },
  onNotification (notification) {
    debug.log('onNotification', notification);
    AlertIOS.alert(
      'Notification Received',
      'Alert message: ' + notification.getMessage(),
      [{
        text: 'Dismiss',
        onPress: null
      }]
    );
  },
  checkPermissions () {
    PushNotificationIOS.checkPermissions((permissions) => {
      debug.log('checkPermissions', permissions);
    });
  },
  requestPermissions () {
    debug.log('requestPermissions');
    PushNotificationIOS.requestPermissions();
  }
};
