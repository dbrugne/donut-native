'use strict';

var React = require('react-native');
var {
  View,
  Text,
  Component,
  StyleSheet
} = React;

var Input = require('../elements/Input');
var Button = require('../elements/Button');
var client = require('../libs/client');
var alert = require('../libs/alert');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'local', {
  'info': 'Your contact details and your following message (optional) will be sent to the moderators of this community.',
  'allowed-pending': 'Access to this community is by invitation, and you already have a request in progress.',
  'allow-pending': 'An access request is already pending',
  'placeholder': 'Your motivations, background ...',
  'success': 'Request sent ! You will be notified when accepted.',
  'unknown-error': 'Unknown error, please retry later',
  'send': 'send'
});

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
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text style={{fontSize: 20, textAlign: 'center'}}>{i18next.t('local:allowed-pending')}</Text>
        </View>
      );
    }
    return (
      <View style={{backgroundColor: '#f0f0f0'}}>
        <Text style={{fontSize: 20}}>
          {i18next.t('local:info')}
        </Text>
        <View style={{backgroundColor: '#FFF', height: 80}}>
          <Input
            placeholder={i18next.t('local:placeholder')}
            multiline={true}
            onChangeText={(text) => this.setState({motivations: text})}
            />
        </View>
        <Button onPress={this.onSendRequest.bind(this)}
          type='green'
          label={i18next.t('local:send')} />
      </View>
    );
  }
  onSendRequest () {
    client.groupRequest(this.props.id, this.state.motivations, function (response) {
      if (response.success) {
        return alert.show(i18next.t('local:success'));
      } else {
        if (response.err === 'allow-pending') {
          return alert.show(i18next.t('local:allow-pending'));
        }
        return alert.show(i18next.t('local:unknown-error'))
      }
    });
  }
}

module.exports = GroupAskMembershipRequest;
