'use strict';

var React = require('react-native');
var Platform = require('Platform');

var {
  Component,
  AlertIOS,
  ToastAndroid
  } = React;

module.exports = {
  show: function(string) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(string, ToastAndroid.SHORT);
    } else {
      AlertIOS.alert(string);
    }
  }
};