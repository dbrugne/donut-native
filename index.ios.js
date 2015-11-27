'use strict';

var React = require('react-native');
var {
  AppRegistry
} = React;

var Index = require('./app/index');
AppRegistry.registerComponent('donutMobile', () => Index);
