'use strict';

var React = require('react-native');
var {
  View
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
    var topic = null;
    if (this.props.data.topic) {
      topic = (
        <ParsedText navigator={this.props.navigator} style={[s.topicContent, {flexWrap: 'wrap'}]}>
          {this.props.data.topic}
        </ParsedText>
      );
    }

    return (
      <View style={{marginTop:5, marginBottom:5}}>
        <AbstractEvent
          text={this.props.data.topic ? i18next.t('local:topic') : i18next.t('local:none')}
          icon='fontawesome|quote-right'
          {...this.props}
          />
        <View style={{marginLeft: 44, flex:1}}>
          {topic}
        </View>
      </View>
    );
  }
});