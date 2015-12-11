'use strict';

var React = require('react-native');
var {
  LinkingIOS,
  IntentAndroid,
  AlertIOS,
  ToastAndroid,
} = React;
var Platform = require('Platform');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'error': 'Can\'t open URL: __url__'
});

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
          ToastAndroid.show(i18next.t('local:error', {url}), ToastAndroid.SHORT);
        }
      });
    } else {
      LinkingIOS.canOpenURL(url, (supported) => {
        if (supported) {
          LinkingIOS.openURL(url);
        } else {
          AlertIOS.alert(i18next.t('local:error', {url}));
        }
      });
    }
  }
};