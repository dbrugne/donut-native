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
      <View style={[s.userBlock, s.event, {marginBottom:0}]}>
        {this._renderAvatar(this.props.data.avatar)}
        <View style={{flexDirection:'row', marginLeft:55}}>
          <Username style={s.username}
                    user_id={this.props.data.user_id}
                    username={this.props.data.username}
                    realname={this.props.data.realname}
                    navigator={this.props.navigator} />
          <Text style={s.time}>{time}</Text>
        </View>
      </View>
    );
  },
  _renderAvatar (avatar) {
    if (!avatar) {
      return (<View style={s.userBlockAvatar}></View>);
    }

    return (<Image style={s.userBlockAvatar} source={{uri: avatar}} />);
  }
});
