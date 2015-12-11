'use strict';

// @doc : https://parse.com/tutorials/ios-push-notifications
// @doc : https://parse.com/docs/rest/guide/#push-notifications-installations

// @todo : what's happen if multiple Parse registration?
// @todo : need to bind installation to user id (so only on (first?) ws connect)

var React = require('react-native');
var {
  AlertIOS,
  PushNotificationIOS
} = React;

var _ = require('underscore');
var debug = require('./debug')('notifications');
var app = require('./app');
var currentUser = require('../models/mobile-current-user');

var PushNotifications = {
  componentDidMount: _.noop,
  componentWillUnmount: _.noop
};

// @source: http://stackoverflow.com/questions/29683720/react-native-push-notifications-parse/30287223#30287223
PushNotifications = {
  componentDidMount () {
    this._checkPermissions();
    PushNotificationIOS.addEventListener('register', this._onRegister.bind(this));
    PushNotificationIOS.addEventListener('notification', this._onNotification.bind(this));
    app.on('_checkPermissions', this._checkPermissions, this);
    app.on('_requestPermissions', this._requestPermissions, this);
  },
  componentWillUnmount () {
    PushNotificationIOS.removeEventListener('register', this._onRegister.bind(this));
    PushNotificationIOS.removeEventListener('notification', this._onNotification.bind(this));
    app.off(null, null, this);
  },
  _onRegister (deviceToken) {
    debug.log('_onRegister', deviceToken);
    this._registerInstallation({
      appIdentifier: 'me.donut', // @conf
      appName: 'donutMobile', // @conf
      appVersion: '1.0', // @conf
      deviceType: 'ios',
      deviceToken: deviceToken,
      channels: ['global'],
      uid: currentUser.getId()
    });
  },
  _onNotification (notification) {
    debug.log('_onNotification', notification);
    AlertIOS.alert(
      'Notification Received',
      'Alert message: ' + notification.getMessage(),
      [{
        text: 'Dismiss',
        onPress: null
      }]
    );
  },
  _checkPermissions () {
    PushNotificationIOS.checkPermissions((permissions) => {
      debug.log('_checkPermissions', permissions);

      // @todo store user has already been prompted
      // no push notifications on this device
      var userHasAlreadyBeenPrompted = false;
      if (userHasAlreadyBeenPrompted && permissions.alert !== 1 && permissions.badge !== 1) {
        return;
      }

      // @todo : is the requestPersmission() sync or async? how to call following only on getting permissions
      PushNotificationIOS.requestPermissions();
    });
  },
  _requestPermissions () {
    debug.log('_requestPermissions');
    PushNotificationIOS.requestPermissions();
  },
  _registerInstallation (data) {
    // inform Parse.com of this device
    var url = 'https://api.parse.com/1/installations';

    debug.log('_registerInstallation', url, data);

    fetch(url, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'X-Parse-Application-Id': 'HLZpzyuliql75EGfdH1o9En9VwDIp4h8KmRHaQ9g', // @conf
        'X-Parse-REST-API-Key': 'cm5inOyCRXVRDAhQVsVvKgSmjvz7qJ9lwgm8niwk', // @conf
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((response) => debug.log(response))
      .catch((err) => debug.warn(err));
  }
};

module.exports = PushNotifications;
