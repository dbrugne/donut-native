'use strict';

var React = require('react-native');
var {
  View,
  Text,
  Component
  } = React;

var s = require('../styles/style');
var alert = require('../libs/alert');
var app = require('../libs/app');
var ListItem = require('../elements/ListItem');

var i18next = require('../libs/i18next');

class GroupAskMembershipRequest extends Component {
  constructor (props) {
    super(props);
    this.state = {
      motivations: ''
    };
  }

  render () {
    if (this.props.isAllowedPending) {
      return (
        <Text style={[s.block]}>{i18next.t('group.allowed-pending')}</Text>
      );
    }
    return (
      <View style={{alignSelf: 'stretch'}}>
        <Text style={[s.block]}>{i18next.t('group.info-request')}</Text>

        <ListItem
          onChangeText={(text) => this.setState({motivations: text})}
          multiline
          placeholder={i18next.t('group.placeholder-request')}
          first
          type='input'
          />

        <Text style={s.listGroupItemSpacing} />
        <ListItem
          onPress={this.onSendRequest.bind(this)}
          last
          action
          type='button'
          text={i18next.t('group.send')}
          />

      </View>
    );
  }

  onSendRequest () {
    app.client.groupRequest(this.props.id, this.state.motivations, function (response) {
      if (response.success) {
        return alert.show(i18next.t('group.success-request'));
      } else {
        if (response.err === 'allow-pending') {
          return alert.show(i18next.t('group.allow-pending'));
        }
        return alert.show(i18next.t('messages.' + response.err));
      }
    });
  }
}

module.exports = GroupAskMembershipRequest;
