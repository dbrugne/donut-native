'use strict';

var React = require('react-native');
var {
  AlertIOS,
  ToastAndroid
} = React;

var Platform = require('Platform');

module.exports = {
  show: function(string) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(string, ToastAndroid.SHORT);
    } else {
      AlertIOS.alert(string);
    }
  }
};