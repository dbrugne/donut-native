'use strict';

var React = require('react-native');
var {
  Text,
  View
} = React;
var Username = require('./Username');
var s = require('../../styles/events');

var i18next = require('../../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'action': 'has been __what__ by '
});

module.exports = React.createClass({
  render () {
    return (
      <View style={[s.statusBlock, s.event]}>
        <Username
          user_id={this.props.data.to_user_id}
          username={this.props.data.to_username}
          navigator={this.props.navigator}
        />
        <Text>{i18next.t('local:action', { what: this.props.type })}</Text>
        <Username
          user_id={this.props.data.user_id}
          username={this.props.data.username}
          navigator={this.props.navigator}
        />
      </View>
    );
  }
});

