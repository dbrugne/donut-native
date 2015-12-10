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

var i18next = require('i18next-client');
var locales = require('../locales/en/translation.json'); // global locales
var _localRes = { // current page locales
  'settings': 'settings',
  'leave': 'Leave this donut',
  'close': 'Close this private discussion'
};

i18next.init({
  fallbackLng: 'en',
  lng: 'en',
  debug: true,
  resStore: {
    en: {translation: _.extend(locales, _localRes)}
  }
});

class RoomSettings extends Component {
  constructor (props) {
    super(props);
  }
  render () {
    if (this.props.model.get('type') === 'room') {
      return (
        <View>
          <Text>{this.props.model.get('identifier')} {i18next.t('settings')}</Text>
          <Button onPress={() => this.props.model.leave()} style={styles.row}>
            {i18next.t('leave')}
          </Button>
        </View>
      );
    } else {
      return (
        <View>
          <Text>{this.props.model.get('identifier')} {i18next.t('settings')}</Text>
          <Button onPress={() => this.props.model.leave()} style={styles.row}>
            {i18next.t('close')}
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
