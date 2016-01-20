'use strict';

var React = require('react-native');
var {
  StyleSheet
  // ...
} = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'COMPONENT_NAME', {
  // ...
});

var COMPONENT_NAME = React.createClass({
  propTypes: {
    model: React.PropTypes.object.isRequired
  },
  getInitialState () {
    return {
      // ...
    };
  },
  componentDidMount () {
    // ...
  },
  componentWillUnmount () {
    // ...
  },
  render () {
    // ...
  }
});

var styles = StyleSheet.create({
  // ...
});

module.exports = COMPONENT_NAME;
