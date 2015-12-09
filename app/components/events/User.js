'use strict';

var React = require('react-native');
var {
  Text,
  View,
  Image
} = React;
var date = require('../../libs/date');
var Username = require('./Username');
var s = require('../../styles/events');

module.exports = React.createClass({
  render () {
    var time = date.shortTime(this.props.data.time);
    return (
      <View style={s.userBlock}>
        <Image style={s.userBlockAvatar} source={{uri: this.props.data.avatar}} />
        <View style={s.userBlockUsernameContainer}>
          <Username user_id={this.props.data.user_id} username={this.props.data.username} navigator={this.props.navigator} />
          <Text style={s.date}>{time}</Text>
        </View>
      </View>
    );
  }
});

