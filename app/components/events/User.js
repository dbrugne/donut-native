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
    var avatar;
    if (this.props.data.avatar) {
      avatar = (<Image style={s.userBlockAvatar} source={{uri: this.props.data.avatar}} />);
    } else {
      avatar = (<View style={s.userBlockAvatar}></View>)
    }
    return (
      <View style={s.userBlock}>
        {avatar}
        <View style={{flexDirection:'row', marginLeft:50}}>
          <Username style={s.username} user_id={this.props.data.user_id} username={this.props.data.username} navigator={this.props.navigator} />
          <Text style={{color: '#666666', fontSize: 12, fontFamily: 'Open Sans', marginLeft: 5}}>{time}</Text>
        </View>
      </View>
    );
  }
});
