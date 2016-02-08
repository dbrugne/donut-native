'use strict';

var React = require('react-native');
var s = require('../../styles/events');
var Username = require('./Username');
var date = require('../../libs/date');
var common = require('@dbrugne/donut-common/mobile');
var userActionSheet = require('../../libs/UserActionsSheet');

var {
  View,
  Text,
  Image,
  TouchableHighlight
} = React;

module.exports = React.createClass({
  contextTypes: {
    actionSheet: React.PropTypes.func
  },
  propTypes: {
    data: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired,
    onPress: React.PropTypes.func
  },
  render () {
    return (
      <View style={{flexDirection: 'row', flex: 1, alignItems: 'flex-start'}}>
        {this._renderAvatar()}
        <View style={{flexDirection: 'column', flex: 1}}>
          <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
            <Username
              user_id={this.props.data.user_id}
              username={this.props.data.username}
              realname={this.props.data.realname}
              navigator={this.props.navigator}
              />
            <Text style={s.time}>{date.shortTime(this.props.data.time)}</Text>
          </View>
          {this.props.children}
        </View>
      </View>
    );
  },
  _renderAvatar () {
    if (!(this.props.data.avatar || this.props.data.avatarRaw)) {
      return null;
    }

    let avatar = this.props.data.avatar;
    if (this.props.data.avatarRaw) {
      avatar = common.cloudinary.prepare(this.props.data.avatarRaw, 40);
    }

    return (
      <TouchableHighlight
        underlayColor='transparent'
        onPress={this.onPress}
        >
        <Image style={{width: 34, height: 34, borderRadius: 3, marginLeft: 10, marginRight: 10}} source={{uri: avatar}}/>
      </TouchableHighlight>
    );
  },
  onPress () {
    if (this.props.onPress) {
      return this.props.onPress();
    }
    userActionSheet.openActionSheet(this.context.actionSheet(), 'roomUsers', this.props.data.room_id, this.props.data);
  }
});
