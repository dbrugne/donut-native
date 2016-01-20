'use strict';

var React = require('react-native');
var {
  PushNotificationIOS,
  AppStateIOS,
  Alert
} = React;

var DonutParse = require('NativeModules').DonutParse;
var navigation = require('../navigation/index');
var utils = require('./utils');
var debug = require('./../libs/debug')('pushNotification');

var PushNotification = React.createClass({
  getInitialState () {
    return {
      appState: 'active',
      nextAppFocus: null
    };
  },
  componentDidMount () {
    AppStateIOS.addEventListener('change', this.onAppStateChange);
    PushNotificationIOS.addEventListener('register', this.onRegister);
    PushNotificationIOS.addEventListener('notification', this.onNotification);

    this._checkPermissions(); // @debug
    this._requestPermissions();
  },
  componentWillUnmount () {
    AppStateIOS.removeEventListener('change', this.onAppStateChange);
    PushNotificationIOS.removeEventListener('register', this.onRegister);
    PushNotificationIOS.removeEventListener('notification', this.onNotification);
  },
  render () {
    return null;
  },
  onAppStateChange (currentAppState) {
    this.setState({
      appState: currentAppState
    });
    if (this.nextAppFocus) {
      // run scheduled notification on app focus
      this.nextAppFocus();
      this.nextAppFocus = null;
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
  handleInitialNotification () {
    var n = PushNotificationIOS.popInitialNotification();
    if (n) {
      debug.log('handleInitialNotification');
      this._goToNotificationCenter();
    }
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
      {text: 'Go To Notifications', onPress: () => this._goToNotificationCenter()},
      {text: 'Cancel', onPress: () => {}, style: 'cancel'}
    ]);
  },
  _checkPermissions () {
    PushNotificationIOS.checkPermissions((permissions) => {
      debug.log('checkPermissions', permissions);
    });
  },
  _requestPermissions () {
    debug.log('requestPermissions');
    PushNotificationIOS.requestPermissions();
  },
  _goToNotificationCenter () {
    navigation.navigate('Notifications');
  }
});

module.exports = PushNotification;
