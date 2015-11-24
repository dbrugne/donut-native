'use strict';
var React = require('react-native');
var _ = require('underscore');
var currentUser = require('../models/mobile-current-user');
var Button = require('react-native-button');

var {
  Component,
  Text,
  ListView,
  View,
  StyleSheet,
  TouchableHighlight
} = React;

var app = require('../libs/app');
var Button = require('react-native-button');

class RoomSettings extends Component {
  constructor (props) {
    super(props);
  }
  render () {
    if (this.props.model.get('type') === 'room') {
      return (
        <View>
          <Text>{this.props.model.get('identifier')} settings</Text>
          <Button onPress={() => this.props.model.leave()} style={styles.row}>
            Leave this donut
          </Button>
        </View>
      );
    } else {
      return (
        <View>
          <Text>{this.props.model.get('identifier')} settings</Text>
          <Button onPress={() => this.props.model.leave()} style={styles.row}>
            Close this private discussion
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
