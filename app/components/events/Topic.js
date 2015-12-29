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
  'topic': 'has changed topic for',
  'none': 'has emptied the topic'
});

module.exports = React.createClass({
  render () {

    var topic;
    if (!this.props.data.topic) {
      topic = (
        <Text style={[s.topicContent, {flexWrap: 'wrap'}]}>
          {i18next.t('local:none')}
        </Text>
      );
    } else {
      topic = (
        <View>
          <Text style={[s.statusBlockText, {flexWrap: 'wrap'}]}>{i18next.t('local:topic')}</Text>
          <ParsedText navigator={this.props.navigator} style={[s.topicContent, {flexWrap: 'wrap'}]}>
            {this.props.data.topic}
          </ParsedText>
        </View>
      );
    }

    var time = date.shortTime(this.props.data.time);
    return (
      <View style={[{flexDirection: 'row', marginVertical: 0}, s.event]}>
        {this._renderAvatar(this.props.data.avatar)}
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
            {topic}
          </View>
        </View>
      </View>
    );
  },
  _renderAvatar (avatar) {
    if (!avatar) {
      return null;
    }

    return (
      <Image style={s.topicBlockAvatar} source={{uri: avatar}}/>
    );
  }
});

