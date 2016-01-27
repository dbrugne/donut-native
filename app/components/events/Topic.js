'use strict';

var React = require('react-native');
var {
  View,
  Text,
} = React;

var ParsedText = require('../ParsedText');
var UserBlock = require('./UserBlock');
var s = require('../../styles/events');

var i18next = require('../../libs/i18next');
i18next.addResourceBundle('en', 'topic', {
  'topic': 'has changed topic',
  'none': 'has emptied the topic'
});

module.exports = React.createClass({
  render () {
    return (
      <View style={s.event}>
        <UserBlock
          navigator={this.props.navigator}
          {...this.props}
        >
          <Text style={s.eventText}>{this._renderTopic()}</Text>
        </UserBlock>
      </View>
    );
  },

  _renderTopic () {
    if (!this.props.data.topic) {
      return (
        <Text style={s.eventText}>{i18next.t('topic:none')}</Text>
      );
    }
    return (
      <ParsedText navigator={this.props.navigator} style={{fontSize: 12, fontFamily: 'Open Sans', color: '#666666'}}>
        {i18next.t('topic:topic')+': "'+this.props.data.topic+'"'}
      </ParsedText>
    );
  }
});