'use strict';

var React = require('react-native');
var {
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
  Component,
} = React;

var app = require('../libs/app');
var client = require('../libs/client');
var _ = require('underscore');

class OnetooneView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      messages: ''
    };
  }
  componentDidMount () {
    client.on('user:message', _.bind(function (data) {
      if (data.from_user_id !== this.props.currentRoute.id) {
        return;
      }

      this.setState({
        messages: this.state.messages + '\n' + data.message
      });
    }, this));
  }
  render() {
    return (
      <View style={styles.main}>
        <Text style={styles.title}>Onetoone @{this.props.currentRoute.title}</Text>
        <View style={styles.events}>
          <Text style={styles.title}>{this.state.messages}</Text>
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#00FF00',
  },
});

module.exports = OnetooneView;
