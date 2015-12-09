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

module.exports = React.createClass({
  render () {
    // @todo i18next
    var message;
    var icon = null;
    switch (this.props.type) {
      case 'user:online':
        message = 'est maintenant en ligne';
        break;
      case 'user:offline':
        message = 'est maintenant hors ligne';
        break;
      case 'room:out':
        message = 'vient de sortir';
        icon = (
          <Icon
            name='fontawesome|sign-out'
            size={12}
            color='#666666'
            style={{width:14, height:14, marginTop:2}}
            />
        );
        break;
      case 'room:in':
        message = 'vient de rentrer';
        icon = (
          <Icon
            name='fontawesome|sign-in'
            size={12}
            color='#666666'
            style={{width:14, height:14, marginTop:2}}
            />
        );
        break;
    }
    var time = date.shortTime(this.props.data.time);
    return (
      <View style={[s.statusBlock, s.event]}>
        <Image style={s.statusBlockAvatar} source={{uri: this.props.data.avatar}}/>
        <View style={{flexDirection:'column'}}>
          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <Username
              user_id={this.props.data.user_id}
              username={this.props.data.username}
              navigator={this.props.navigator}
              />
            <Text style={{color: '#666666', fontSize: 12, fontFamily: 'Open Sans', marginLeft: 5}}>{time}</Text>
          </View>
          <View style={{flexDirection:'row', justifyContent:'center'}}>
            {icon}
            <Text style={{ fontSize: 12, fontFamily: 'Open Sans', color: '#666666' }}> {message}</Text>
          </View>
        </View>
      </View>
    );
  }
});
