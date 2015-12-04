'use strict';

var React = require('react-native');
var Platform = require('Platform');

var {
  Component,
  LinkingIOS,
  IntentAndroid,
  AlertIOS,
  ToastAndroid,
  } = React;

module.exports = {
  open: function (url) {
    this._openURL(url);
  },

  _openURL: function (url) {
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