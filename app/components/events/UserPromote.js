'use strict';

var React = require('react-native');
var {
  Text,
  View
} = React;
var Username = require('./Username');
var s = require('../../styles/events');
var UserBlock = require('./UserBlock');

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
        what = 'blocked'; break;
      case 'user:deban':
        what = 'unblocked'; break;
      default :
        what = this.props.type;
    }
    return (
        <View style={s.event}>
          <UserBlock
            navigator={this.props.navigator}
            data={{user_id: this.props.data.to_user_id, username: this.props.data.to_username, realname: this.props.data.to_realname, avatar: this.props.data.to_avatar}}
            >
            <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
              <Text style={s.eventText}>{i18next.t('userPromote:action', { what: what })}</Text>
              <Username
                user_id={this.props.data.user_id}
                username={this.props.data.username}
                realname={this.props.data.realname}
                navigator={this.props.navigator}
                />
            </View>
          </UserBlock>
        </View>
    );
  }
});

