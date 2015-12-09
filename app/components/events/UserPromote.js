'use strict';

var React = require('react-native');
var {
  Text,
  View
} = React;
var Username = require('./Username');
var s = require('../../styles/events');

module.exports = React.createClass({
  render () {
    // @todo i18next
    return (
      <View style={[s.promoteBlock, s.event]}>
        <Username
          user_id={this.props.data.to_user_id}
          username={this.props.data.to_username}
          navigator={this.props.navigator}
        />
        <Text> a été {this.props.type} par </Text>
        <Username
          user_id={this.props.data.user_id}
          username={this.props.data.username}
          navigator={this.props.navigator}
        />
      </View>
    );
  }
});

