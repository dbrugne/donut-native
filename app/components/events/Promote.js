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

var i18next = require('../../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'room:op' : 'is now a moderator as requested by',
  'room:deop' : 'is no longer a moderator as requested by',
  'room:kick' : 'was kicked out by',
  'room:ban' : 'was banned by',
  'room:deban' : 'is no longer banned as requested by',
  'room:voice' : 'is no longer mute as requested by',
  'room:devoice' : 'is now mute as requested by',
  'room:groupban' : 'was banned from community by',
  'room:groupdisallow' : 'is no longer member from community by',
  'user:ban' : 'was blocked by',
  'user:deban' : 'is no longer blocked as requested by'
});

module.exports = React.createClass({
  render () {
    var message;
    switch (this.props.type) {
      case 'room:op':            message = i18next('local:room:op'); break;
      case 'room:deop':          message = i18next('local:room:deop'); break;
      case 'room:kick':          message = i18next('local:room:kick'); break;
      case 'room:ban':           message = i18next('local:room:ban'); break;
      case 'room:deban':         message = i18next('local:room:deban'); break;
      case 'room:voice':         message = i18next('local:room:voice'); break;
      case 'room:devoice':       message = i18next('local:room:devoice'); break;
      case 'room:groupban':      message = i18next('local:room:groupban'); break;
      case 'room:groupdisallow': message = i18next('local:room:groupdisallow'); break;
      case 'user:ban':           message = i18next('local:user:ban'); break;
      case 'user:deban':         message = i18next('local:user:deban'); break;
    }
    var time = date.shortTime(this.props.data.time);
    // @todo check how to wrap <Text> tag, currently not wrapping correctly
    return (
      <View style={[{flexDirection: 'row', marginVertical: 0, flexWrap: 'wrap'}, s.event]}>
        <Image style={s.statusBlockAvatar} source={{uri: this.props.data.avatar}}/>
        <View style={{flexDirection:'column', flex:1, flexWrap: 'wrap'}}>
          <View style={{flexDirection:'row'}}>
            <Username
              style={s.username}
              user_id={this.props.data.user_id}
              username={this.props.data.username}
              navigator={this.props.navigator}
              />
            <Text style={{color: '#666666', fontSize: 12, fontFamily: 'Open Sans', marginLeft: 5}}>{time}</Text>
          </View>
          <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
              <Text style={[s.statusBlockText, {flexWrap: 'wrap'}]}>{message}</Text>
              <Username
                style={s.username}
                user_id={this.props.data.by_user_id}
                username={this.props.data.by_username}
                navigator={this.props.navigator}
                />
            </View>
        </View>
      </View>
    );
  }
});