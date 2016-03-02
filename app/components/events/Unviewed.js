'use strict';

var React = require('react-native');
var {
  Text,
  View,
  StyleSheet
} = React;
var s = require('../../styles/events');
var i18next = require('../../libs/i18next');

var UnviewedEvent = React.createClass({
  render () {
    return (
      <View style={styles.main}>
        <Text style={styles.text}>{i18next.t('events.unread-messages')}</Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  main: {
    position: 'relative',
    height: 0.5,
    backgroundColor: '#fc2063'
  },
  text: {
    fontFamily: 'Open Sans',
    color: '#fc2063',
    backgroundColor: '#ffffff',
    fontSize: 8,
    lineHeight: 16,
    position: 'absolute',
    right: 0,
    paddingRight: 5,
    paddingLeft: 5,
    top: -9
  }
});

module.exports = UnviewedEvent;