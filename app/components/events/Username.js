'use strict';

var React = require('react-native');
var {
  Text,
  TouchableHighlight
} = React;
var navigation = require('../../libs/navigation');
var s = require('../../styles/events');

module.exports = React.createClass({
  render () {
    return (
      <TouchableHighlight
          underlayColor='transparent'
          onPress={this.onPress}
      >
        <Text style={[s.username, this.props.style]}>@{this.props.username}</Text>
      </TouchableHighlight>
    );
  },
  onPress () {
    let route = navigation.getProfile({
      type: 'user',
      id: this.props.user_id,
      identifier: '@' + this.props.username
    });
    this.props.navigator.push(route);
  }
});