'use strict';

var React = require('react-native');
var {
  PushNotificationIOS,
  AppStateIOS,
  Alert
} = React;

var DonutParse = require('react-native').NativeModules.DonutParse;
var utils = require('./utils');
var navigation = require('../navigation/index');

var debug = require('./../libs/debug')('pushNotification');

module.exports = {
  appState: 'active', // @todo : refactor to component
  nextAppFocus: null,
  componentDidMount () {
    AppStateIOS.addEventListener('change', this.onAppStateChange.bind(this));
    PushNotificationIOS.addEventListener('register', this.onRegister.bind(this));
    PushNotificationIOS.addEventListener('notification', this.onNotification.bind(this));

    this.checkPermissions(); // @debug
    this.requestPermissions();
  },
  componentWillUnmount () {
    AppStateIOS.removeEventListener('change', this.onAppStateChange.bind(this));
    PushNotificationIOS.removeEventListener('register', this.onRegister.bind(this));
    PushNotificationIOS.removeEventListener('notification', this.onNotification.bind(this));
  },
  onAppStateChange (currentAppState) {
    this.appState = currentAppState;
    if (this.nextAppFocus) {
      // run scheduled notification on app focus
      this.nextAppFocus();
      this.nextAppFocus = null;
    }
  },
  handleInitialNotification () {
    var n = PushNotificationIOS.popInitialNotification();
    if (n) {
      debug.log('handleInitialNotification');
      this.goToNotificationCenter();
    }
  },
  onRegister (deviceToken) {
    debug.log('onRegister', deviceToken);
    DonutParse.getParseInstallationObjectId((err, objectId) => {
      if (err) {
        return debug.warn('onRegister', err);
      }
      utils.registerDeviceOnDonut(objectId);
    });
  },
  onNotification (n) {
    debug.log('onNotification');
    this._handleNotification(n);
  },
  _handleNotification (pushNotification) {
    debug.log('_handleNotification', pushNotification);

    if (this.appState !== 'active') {
      // schedule notification for next app focus
      this.nextAppFocus = () => {
        this._handleNotification(pushNotification);
      };
      return debug.log('_handleNotification appState is active, do nothing');
    }

    if (pushNotification.getAlert() && !pushNotification.getData()) {
      // test notification from parse interface
      return Alert.alert(pushNotification.getAlert());
    }

    var data = pushNotification.getData();

    debug.log('handleNotification', data);
    Alert.alert(pushNotification.getAlert(), data.title, [
      {text: 'Go To Notifications', onPress: () => this.goToNotificationCenter()},
      {text: 'Cancel', onPress: () => {}, style: 'cancel'}
    ]);
  },
  checkPermissions () {
    PushNotificationIOS.checkPermissions((permissions) => {
      debug.log('checkPermissions', permissions);
    });
  },
  requestPermissions () {
    debug.log('requestPermissions');
    PushNotificationIOS.requestPermissions();
  },
  goToNotificationCenter () {
    navigation.navigate('Notifications');
  }
};
