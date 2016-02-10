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
i18next.addResourceBundle('en', 'promote', {
  'room-op': 'is now a moderator as requested by ',
  'room-deop': 'is no longer a moderator as requested by ',
  'room-kick': 'was kicked out by ',
  'room-ban': 'was banned by ',
  'room-deban': 'is no longer banned as requested by ',
  'room-voice': 'is no longer mute as requested by ',
  'room-devoice': 'is now mute as requested by ',
  'room-groupban': 'was banned from community by ',
  'room-groupdisallow': 'is no longer member from community by ',
  'user-ban': 'was blocked by ',
  'user-deban': 'is no longer blocked as requested by '
});

module.exports = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    type: React.PropTypes.string.isRequired,
    navigator: React.PropTypes.object.isRequired,
    model: React.PropTypes.object
  },
  render () {
    let message;
    switch (this.props.type) {
      case 'room:op':
        message = i18next.t('promote:room-op');
        break;
      case 'room:deop':
        message = i18next.t('promote:room-deop');
        break;
      case 'room:kick':
        message = i18next.t('promote:room-kick');
        break;
      case 'room:ban':
        message = i18next.t('promote:room-ban');
        break;
      case 'room:deban':
        message = i18next.t('promote:room-deban');
        break;
      case 'room:voice':
        message = i18next.t('promote:room-voice');
        break;
      case 'room:devoice':
        message = i18next.t('promote:room-devoice');
        break;
      case 'room:groupban':
        message = i18next.t('promote:room-groupban');
        break;
      case 'room:groupdisallow':
        message = i18next.t('promote:room-groupdisallow');
        break;
      case 'user:ban':
        message = i18next.t('promote:user-ban');
        break;
      case 'user:deban':
        message = i18next.t('promote:user-deban');
        break;
    }

    return (
      <View style={s.event}>
        <UserBlock
          navigator={this.props.navigator}
          model={this.props.model}
          {...this.props}
          >
          <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
            <Text style={s.eventText}>{message}</Text>
            <Username
              user_id={this.props.data.by_user_id}
              username={this.props.data.by_username}
              realname={this.props.data.by_realname}
              navigator={this.props.navigator}
              model={this.props.model}
              />
          </View>
        </UserBlock>
      </View>
    );
  }
});
