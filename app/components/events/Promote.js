'use strict';

var React = require('react-native');
var {
  Text,
  View,
  Image
} = React;
var {
  Icon
  } = require('react-native-icons');

var date = require('../../libs/date');
var Username = require('./Username');
var s = require('../../styles/events');
var AbstractEvent = require('./AbstractEvent');

var i18next = require('../../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'room-op' : 'is now a moderator as requested by',
  'room-deop' : 'is no longer a moderator as requested by',
  'room-kick' : 'was kicked out by',
  'room-ban' : 'was banned by',
  'room-deban' : 'is no longer banned as requested by',
  'room-voice' : 'is no longer mute as requested by',
  'room-devoice' : 'is now mute as requested by',
  'room-groupban' : 'was banned from community by',
  'room-groupdisallow' : 'is no longer member from community by',
  'user-ban' : 'was blocked by',
  'user-deban' : 'is no longer blocked as requested by'
});

module.exports = React.createClass({
  render () {
    let message, _icon, _color;
    switch (this.props.type) {
      case 'room:op':            message = i18next.t('local:room-op');            break;
      case 'room:deop':          message = i18next.t('local:room-deop');          break;
      case 'room:kick':          message = i18next.t('local:room-kick');          break;
      case 'room:ban':           message = i18next.t('local:room-ban');           break;
      case 'room:deban':         message = i18next.t('local:room-deban');         break;
      case 'room:voice':         message = i18next.t('local:room-voice');         break;
      case 'room:devoice':       message = i18next.t('local:room-devoice');       break;
      case 'room:groupban':      message = i18next.t('local:room-groupban');      break;
      case 'room:groupdisallow': message = i18next.t('local:room-groupdisallow'); break;
      case 'user:ban':           message = i18next.t('local:user-ban');           break;
      case 'user:deban':         message = i18next.t('local:user-deban');         break;
    }
    //let time = date.shortTime(this.props.data.time);

    return (
      <View style={s.event}>
        <AbstractEvent
          {...this.props}
          >
          <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
            <Text style={[s.statusBlockText, {flexWrap: 'wrap'}]}>{message}</Text>
            <Username
              style={s.username}
              user_id={this.props.data.by_user_id}
              username={this.props.data.by_username}
              realname={this.props.data.by_realname}
              navigator={this.props.navigator}
              />
          </View>
        </AbstractEvent>
      </View>
    );


    //return (
    //  <View style={[{flexDirection: 'row', marginVertical: 0, flexWrap: 'wrap'}, s.event]}>
    //    {this._renderAvatar(this.props.data.avatar)}
    //    <View style={{flexDirection:'column', flex:1, flexWrap: 'wrap'}}>
    //      <View style={{flexDirection:'row'}}>
    //        <Username
    //          style={s.username}
    //          user_id={this.props.data.user_id}
    //          username={this.props.data.username}
    //          navigator={this.props.navigator}
    //          />
    //        <Text style={s.time}>{time}</Text>
    //      </View>
    //      <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
    //        <Text style={[s.statusBlockText, {flexWrap: 'wrap'}]}>{message}</Text>
    //        <Username
    //          style={s.username}
    //          user_id={this.props.data.by_user_id}
    //          username={this.props.data.by_username}
    //          navigator={this.props.navigator}
    //          />
    //      </View>
    //    </View>
    //  </View>
    //);
  },
  //_renderAvatar (avatar) {
  //  if (!avatar) {
  //    return null;
  //  }
  //
  //  return (
  //    <Image style={s.statusBlockAvatar} source={{uri: avatar}}/>
  //  );
  //}
});