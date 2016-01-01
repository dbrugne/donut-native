'use strict';

// @doc : https://parse.com/tutorials/ios-push-notifications
// @doc : https://parse.com/docs/rest/guide/#push-notifications-installations

var React = require('react-native');
var {
  AlertIOS,
  PushNotificationIOS
} = React;

var utils = require('./utils');

var DonutParse = require('react-native').NativeModules.DonutParse;

var debug = require('./../libs/debug')('pushNotification');

// @source: http://stackoverflow.com/questions/29683720/react-native-push-notifications-parse/30287223#30287223
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
        console.warn(err);
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
