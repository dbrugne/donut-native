'use strict';

var React = require('react-native');
var {
  LinkingIOS,
  IntentAndroid,
  AlertIOS,
  ToastAndroid,
} = React;
var Platform = require('Platform');

var _ = require('underscore');
var i18next = require('i18next-client');
var locales = require('../locales/en/translation.json'); // global locales
var _localRes = { // current page locales
  'error': 'Can\'t open URL: __url__'
};
i18next.init({
  fallbackLng: 'en',
  lng: 'en',
  debug: true,
  resStore: {
    en: {translation: _.extend(locales, _localRes)}
  }
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
          ToastAndroid.show(i18next.t('error', {url}), ToastAndroid.SHORT);
        }
      });
    } else {
      LinkingIOS.canOpenURL(url, (supported) => {
        if (supported) {
          LinkingIOS.openURL(url);
        } else {
          AlertIOS.alert(i18next.t('error', {url}));
        }
      });
    }
  }
};