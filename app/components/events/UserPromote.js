'use strict';

var React = require('react-native');
var {
  Text,
  View
} = React;
var Username = require('./Username');
var s = require('../../styles/events');

var i18next = require('../../libs/i18next');
i18next.addResourceBundle('en', 'userPromote', {
  'action': ' has been __what__ by '
});

module.exports = React.createClass({
  propTypes: {
    type: React.PropTypes.string,
    data: React.PropTypes.object,
    navigator: React.PropTypes.object
  },
  render: function () {
    var what;
    switch (this.props.type) {
      case 'user:ban':
        what = 'banned'; break;
      case 'user:deban':
        what = 'unbanned'; break;
      default :
        what = this.props.type;
    }
    return (
      <View style={[s.statusBlock, s.event, {marginLeft: 25}]}>
        <Username
          user_id={this.props.data.to_user_id}
          username={this.props.data.to_username}
          navigator={this.props.navigator}
        />
        <Text>{i18next.t('userPromote:action', { what: what })}</Text>
        <Username
          user_id={this.props.data.user_id}
          username={this.props.data.username}
          navigator={this.props.navigator}
        />
      </View>
    );
  }
});

