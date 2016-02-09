'use strict';

var React = require('react-native');
var {
  ToastAndroid,
  Alert
} = React;

var Platform = require('Platform');

module.exports = {
  show: function (string) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(string, ToastAndroid.SHORT);
    } else {
      Alert.alert(
        '',
        string
      );
    }
  },
  askConfirmation: function(title, message, onConfirm, onCancel) {
    Alert.alert(
      title,
      message,
      [
        {text: 'Cancel', onPress: () => onCancel(), style: 'cancel'},
        {text: 'OK', onPress: () => onConfirm()}
      ]
    );
  }
};