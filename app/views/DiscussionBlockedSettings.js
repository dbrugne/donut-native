'use strict';
var React = require('react-native');
var _ = require('underscore');
var currentUser = require('../models/mobile-current-user');
var Button = require('react-native-button');
var app = require('../libs/app');

var {
  Component,
  Text,
  ListView,
  View,
  StyleSheet,
  TouchableHighlight
} = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'settings': 'settings',
  'close-donut': 'Close this donut',
  'close-community': 'Close this community'
});

class DiscussionBlockedSettings extends Component {
  constructor (props) {
    super(props);
  }
  render () {
    return (
      <View>
        <Text>{this.props.model.get('identifier')} {i18next.t('local:settings')}</Text>
        <Button onPress={() => this.props.model.leaveBlocked()} style={styles.row}>
          {i18next.t('local:close-donut')}
        </Button>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEE',
    color: '#777',
    lineHeight: 40
  }
});

module.exports = DiscussionBlockedSettings;
