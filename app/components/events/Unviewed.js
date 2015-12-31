'use strict';

var React = require('react-native');
var {
  Text,
  View
} = React;
var s = require('../../styles/events');
var i18next = require('../../libs/i18next');

module.exports = React.createClass({
  render () {
    return (
      <View style={[s.dateBlock, s.event]}>
        <View style={{marginLeft:10, flex:1, justifyContent: 'center', flexDirection: 'column'}}>
          <View style={{height:1, backgroundColor: '#fc2063'}}></View>
        </View>
        <Text style={{fontFamily: 'Open Sans', color: '#fc2063', marginLeft:10, marginRight:10, fontSize:10, lineHeight:16}}>{i18next.t('events.unread-messages')}</Text>
      </View>
    );
  }
});
