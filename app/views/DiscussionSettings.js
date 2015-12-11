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
  'leave': 'Leave this donut',
  'close': 'Close this private discussion'
});

class RoomSettings extends Component {
  constructor (props) {
    super(props);
  }
  render () {
    if (this.props.model.get('type') === 'room') {
      return (
        <View>
          <Text>{this.props.model.get('identifier')} {i18next.t('local:settings')}</Text>
          <Button onPress={() => this.props.model.leave()} style={styles.row}>
            {i18next.t('local:leave')}
          </Button>
        </View>
      );
    } else {
      return (
        <View>
          <Text>{this.props.model.get('identifier')} {i18next.t('local:settings')}</Text>
          <Button onPress={() => this.props.model.leave()} style={styles.row}>
            {i18next.t('local:close')}
          </Button>
        </View>
      );
    }
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

module.exports = RoomSettings;
