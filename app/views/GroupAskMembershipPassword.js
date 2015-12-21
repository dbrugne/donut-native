'use strict';

var React = require('react-native');
var {
  View,
  Text,
  Component,
  StyleSheet
} = React;

var _ = require('underscore');
var Input = require('../elements/Input');
var Button = require('../elements/Button');
var alert = require('../libs/alert');
var navigation = require('../libs/navigation');
var app = require('../libs/app');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'membershipPassword', {
  'info': 'Enter the password :',
  'placeholder': 'password',
  'wrong-password': 'invalid password',
  'unknown-error': 'Unknown error, please retry later',
  'send': 'send'
});

class GroupAskMembershipPassword extends Component {
  constructor (props) {
    super(props);
    this.state = {
      password: ''
    }
  }
  render () {
    return (
      <View style={{backgroundColor: '#f0f0f0'}}>
        <Text style={{fontSize: 20}}>
          {i18next.t('membershipPassword:info')}
        </Text>
        <View style={{backgroundColor: '#FFF'}}>
          <Input
            placeholder={i18next.t('membershipPassword:placeholder')}
            secureTextEntry={true}
            onChangeText={(text) => this.setState({password: text})}
            />
        </View>
        <Button onPress={this.onSendPassword.bind(this)}
                type='green'
                label={i18next.t('membershipPassword:send')} />
      </View>
    );
  }
  onSendPassword () {
    if (!this.state.password) {
      return alert.show(i18next.t('membershipPassword:wrong-password'));
    }
    app.client.groupJoin(this.props.id, this.state.password, _.bind(function (response) {
      if (response.success) {
        this.props.navigator.popToTop();
        app.trigger('refreshGroup');
      } else {
        if (response.err === 'wrong-password') {
          return alert.show(i18next.t('membershipPassword:wrong-password'));
        }
        return alert.show(i18next.t('membershipPassword:unknown-error'))
      }
    },this));
  }
}

module.exports = GroupAskMembershipPassword;
