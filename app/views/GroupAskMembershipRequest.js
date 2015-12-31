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
var alert = require('../libs/alert');
var app = require('../libs/app');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'membershipRequest', {

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
          <Text style={{fontSize: 20, textAlign: 'center'}}>{i18next.t('group.allowed-pending')}</Text>
        </View>
      );
    }
    return (
      <View style={{backgroundColor: '#f0f0f0'}}>
        <Text style={{fontSize: 20}}>
          {i18next.t('group.info-request')}
        </Text>
        <View style={{backgroundColor: '#FFF', height: 80}}>
          <Input
            placeholder={i18next.t('group.placeholder-request')}
            multiline={true}
            onChangeText={(text) => this.setState({motivations: text})}
            />
        </View>
        <Button onPress={this.onSendRequest.bind(this)}
          type='green'
          label={i18next.t('group.send')} />
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
        return alert.show(i18next.t('messages.unknownerror'))
      }
    });
  }
}

module.exports = GroupAskMembershipRequest;
