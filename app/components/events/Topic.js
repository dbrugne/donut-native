'use strict';

var React = require('react-native');
var {
  View,
  Text,
  Image
} = React;
var date = require('../../libs/date');
var ParsedText = require('../ParsedText');
var navigation = require('../../libs/navigation');
var Username = require('./Username');
var s = require('../../styles/events');

var i18next = require('../../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'topic': 'has changed topic for'
});

module.exports = React.createClass({
  render () {
    if (!this.props.data.topic) {
      return;
    }

    var time = date.shortTime(this.props.data.time);
    return (
      <View style={[{flexDirection: 'row', marginVertical: 0}, s.event]}>
        <Image style={s.topicBlockAvatar} source={{uri: this.props.data.avatar}}/>
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
            <Text style={[s.statusBlockText, {flexWrap: 'wrap'}]}>{i18next.t('local:topic')}</Text>
            <ParsedText navigator={this.props.navigator} style={[s.topicContent, {flexWrap: 'wrap'}]}>
              {this.props.data.topic}
            </ParsedText>
          </View>
        </View>
      </View>
    );
  }
});

