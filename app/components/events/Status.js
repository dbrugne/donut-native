'use strict';

var React = require('react-native');
var {
  Text,
  View,
  Image
  } = React;

var s = require('../../styles/events');
var AbstractEvent = require('./AbstractEvent');
var i18next = require('../../libs/i18next');

module.exports = React.createClass({
  render () {
    var message;
    switch (this.props.type) {
      case 'user:online': message = i18next.t('events.online'); break;
      case 'user:offline': message = i18next.t('events.offline'); break;
      case 'room:out': message = i18next.t('events.out'); break;
      case 'room:in': message = i18next.t('events.in'); break;
    }

    return (
      <View style={s.event}>
        <AbstractEvent
          {...this.props}
          >
          <Text style={s.eventText}>{message}</Text>
        </AbstractEvent>
      </View>
    );
  }
});
