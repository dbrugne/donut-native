'use strict';

var React = require('react-native');
var {
  DeviceEventEmitter
} = React;
var _ = require('underscore');
var app = require('../libs/app');

var debug = require('../libs/debug')('keyboard');

module.exports = React.createClass({
  componentDidMount () {
    this.subscription = [
      DeviceEventEmitter.addListener('keyboardWillShow', this.onKeyboardWillShow),
      DeviceEventEmitter.addListener('keyboardWillHide', this.onKeyboardWillHide)
    ];
  },
  componentWillUnmount () {
    _.each(this.subscription, (s) => s.remove());
  },
  render () {
    return null;
  },
  onKeyboardWillShow (frames) {
    debug.log('keyboardWillShow, height:', frames.endCoordinates.height);
    app.trigger('keyboardWillShow', frames.endCoordinates.height);
  },
  onKeyboardWillHide () {
    debug.log('keyboardWillHide');
    app.trigger('keyboardWillHide');
  }
});
