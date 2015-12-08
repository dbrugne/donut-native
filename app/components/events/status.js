'use strict';

var React = require('react-native');
var {
  Text,
  View,
  Image
} = React;
var Username = require('./Username');
var s = require('../../styles/events');

module.exports = React.createClass({
  render () {
    // @todo i18next
    var message;
    switch (this.props.type) {
      case 'user:online':
        message = 'est maintenant en ligne';
        break;
      case 'user:offline':
        message = 'est maintenant hors ligne';
        break;
      case 'room:out':
        message = 'vient de sortir';
        break;
      case 'room:in':
        message = 'vient de rentrer';
        break;
    }
    return (
      <View style={[s.statusBlock, s.event]}>
        <Image style={s.statusBlockAvatar} source={{uri: this.props.data.avatar}}/>
        <Username
          user_id={this.props.data.user_id}
          username={this.props.data.username}
          navigator={this.props.navigator}
        />
        <Text style={s.statusBlockText}> {message}</Text>
      </View>
    );
  }
});
