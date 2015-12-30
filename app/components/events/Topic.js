'use strict';

var React = require('react-native');
var {
  View,
  Text,
} = React;

var ParsedText = require('../ParsedText');
var AbstractEvent = require('./AbstractEvent');
var s = require('../../styles/events');

var i18next = require('../../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'topic': 'has changed topic',
  'none': 'has emptied the topic'
});

module.exports = React.createClass({
  render () {
    return (
      <View style={s.event}>
        <AbstractEvent
          {...this.props}
        >
          <Text style={{fontSize: 12, fontStyle:'italic', fontFamily: 'Open Sans', color: '#333333', marginLeft:3}}>{this._renderTopic()}</Text>
        </AbstractEvent>
      </View>
    );
  },

  _renderTopic () {
    if (!this.props.data.topic) {
      return (
        <Text style={{fontSize: 12, fontFamily: 'Open Sans', color: '#666666', marginLeft:3}}>{i18next.t('local:none')}</Text>
      );
    }
    return (
      <ParsedText navigator={this.props.navigator} style={{fontSize: 12, fontFamily: 'Open Sans', color: '#666666'}}>
        {i18next.t('local:topic')+': "'+this.props.data.topic+'"'}
      </ParsedText>
    );
  }
});