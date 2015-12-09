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
    // @todo i18next
    var message;
    switch (this.props.type) {
      case 'room:op': message = "est maintenant modérateur à la demande de "; break;
      case 'room:deop': message = "n'est plus modérateur à la demande de "; break;
      case 'room:kick': message = "a été expulsé à la demande de "; break;
      case 'room:ban': message = "a été banni à la demande de "; break;
      case 'room:deban': message = "n'est plus banni à la demande de "; break;
      case 'room:voice': message = "a retrouvé la parole à la demande de "; break;
      case 'room:devoice': message = "est muet à la demande de "; break;
      case 'room:groupban': message = "a été banni de la communauté à la demande de "; break;
      case 'room:groupdisallow': message = "n'est plus membre de la communauté à la demande de "; break;
      case 'user:ban': message = "est bloqué à la demande de "; break;
      case 'user:deban': message = "n'est plus bloqué à la demande de "; break;
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