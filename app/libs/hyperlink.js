'use strict';

var React = require('react-native');
var {
  LinkingIOS,
  IntentAndroid,
  AlertIOS,
  ToastAndroid,
} = React;
var Platform = require('Platform');

module.exports = {
  open (url) {
    this._openURL(url);
  },
  _openURL (url) {
    if (Platform.OS === 'android') {
      IntentAndroid.canOpenURL(url, (supported) => {
        if (supported) {
          IntentAndroid.openURL(url);
        } else {
          ToastAndroid.show('Can\'t open URL: ' + url, ToastAndroid.SHORT);
        }
      });
    } else {
      LinkingIOS.canOpenURL(url, (supported) => {
        if (supported) {
          LinkingIOS.openURL(url);
        } else {
          AlertIOS.alert('Can\'t open URL: ' + url);
        }
      });
    }
  }
};