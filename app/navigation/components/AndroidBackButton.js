'use strict';

var React = require('react-native');
var {
  Platform,
  BackAndroid
} = React;

var state = require('../state');

module.exports = React.createClass({
  componentDidMount () {
    if (Platform.OS === 'android') {
      BackAndroid.addEventListener('hardwareBackPress', () => this.onPress());
    }
  },
  componentWillUnmount () {
    if (Platform.OS === 'android') {
      BackAndroid.removeEventListener('hardwareBackPress', () => this.onPress());
    }
  },
  render () {
    return null;
  },
  onPress () {
    if (state.currentRoute && state.currentRoute.onBack) {
      if (typeof state.currentRoute.onBack === 'function') {
        state.currentRoute.onBack();
        // returning true to prevent default back button action to be run
        return true;
      }
      return false;
    }
  }
});