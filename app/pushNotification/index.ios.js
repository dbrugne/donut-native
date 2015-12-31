'use strict';

// @doc : https://parse.com/tutorials/ios-push-notifications
// @doc : https://parse.com/docs/rest/guide/#push-notifications-installations

var React = require('react-native');
var {
  AlertIOS,
  PushNotificationIOS
} = React;

var utils = require('./utils');

var debug = require('./../libs/debug')('pushNotification');

// @source: http://stackoverflow.com/questions/29683720/react-native-push-notifications-parse/30287223#30287223
module.exports = {
  componentDidMount () {
    PushNotificationIOS.addEventListener('register', this.onRegister.bind(this));
    PushNotificationIOS.addEventListener('notification', this.onNotification.bind(this));

    this.checkAndRequestPermissions();
  },
  componentWillUnmount () {
    PushNotificationIOS.removeEventListener('register', this.onRegister.bind(this));
    PushNotificationIOS.removeEventListener('notification', this.onNotification.bind(this));
  },
  onRegister (deviceToken) {
    debug.log('onRegister', deviceToken);
    utils.registerInstallation(deviceToken);
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
  abandonPermissions () {
    debug.log('abandonPermissions');
    PushNotificationIOS.abandonPermissions();
  },
  checkAndRequestPermissions () {
    PushNotificationIOS.checkPermissions((permissions) => {
      debug.log('checkPermissions', permissions);
      PushNotificationIOS.requestPermissions();
    });
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
