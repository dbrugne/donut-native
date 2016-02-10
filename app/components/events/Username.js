'use strict';

var React = require('react-native');
var {
  Text,
  TouchableHighlight
} = React;
var navigation = require('../../navigation/index');
var s = require('../../styles/events');
var userActionSheet = require('../../libs/UserActionsSheet');
var _ = require('underscore');

module.exports = React.createClass({
  contextTypes: {
    actionSheet: React.PropTypes.func
  },
  propTypes: {
    style: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.number, React.PropTypes.array]),
    user_id: React.PropTypes.string.isRequired,
    username: React.PropTypes.string.isRequired,
    realname: React.PropTypes.string,
    navigator: React.PropTypes.object.isRequired,
    prepend: React.PropTypes.string,
    onPress: React.PropTypes.func,
    model: React.PropTypes.object
  },
  render () {
    var realname = null;
    if (this.props.realname) {
      realname = (
        <Text style={[s.username, this.props.style]}>{_.unescape(this.props.realname) + ' '}</Text>
      );
    }
    this.prepend = (this.props.prepend ? this.props.prepend + ' ' : '');
    return (
      <TouchableHighlight
        underlayColor='transparent'
        onPress={this.onPress}
        >
        <Text>
          <Text style={[this.props.style]}>{this.prepend}</Text>
          {realname}
          <Text style={[s.username, this.props.style, realname && s.username2]}>@{this.props.username}</Text>
        </Text>
      </TouchableHighlight>
    );
  },
  onPress () {
    if (this.props.onPress) {
      return this.props.onPress();
    }
    if (this.props.model) {
      return userActionSheet.openRoomActionSheet(this.context.actionSheet(), 'roomUsers', this.props.model, {user_id: this.props.user_id, username: this.props.username, realname: this.props.realname});
    }
    navigation.navigate('Profile', {
      type: 'user',
      id: this.props.user_id,
      identifier: '@' + this.props.username
    });
  }
});
