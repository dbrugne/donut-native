'use strict';

var React = require('react-native');
var {
  View
} = React;

var alert = require('../libs/alert');
var app = require('../libs/app');
var Button = require('../components/Button');
var Disclaimer = require('../components/Disclaimer');
var ListItem = require('../components/ListItem');
var GroupHeader = require('./GroupHeader');
var KeyboardAwareComponent = require('../components/KeyboardAware');
var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'GroupAskPassword', {
  'placeholder-password': 'password',
  'info-password': 'ENTER THE PASSWORD',
  'send': 'SEND'
});

var GroupAskPassword = React.createClass({
  propTypes: {
    data: React.PropTypes.any,
    navigator: React.PropTypes.object,
    scroll: React.PropTypes.bool
  },
  getInitialState: function () {
    return {
      data: this.props.data,
      password: null,
      loadingPassword: false
    };
  },
  render: function () {
    let content = (
      <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'column', alignItems: 'center', paddingVertical: 20 }}>
        <View style={{alignSelf: 'stretch'}}>
          <ListItem type='input'
                    autoCapitalize='none'
                    ref='input'
                    first
                    last
                    placeholder={i18next.t('GroupAskPassword:placeholder-password')}
                    onChangeText={(text) => this.setState({password: text})}
                    value={this.state.password}
                    style={{ alignSelf: 'stretch' }}
                    title={i18next.t('GroupAskPassword:info-password')}
            />
        </View>
        <View style={{ flex: 1 }}/>
        <Button type='gray'
                onPress={this.onSendPassword}
                label={i18next.t('GroupAskPassword:send')}
                loading={this.state.loadingPassword}
                style={{ alignSelf: 'stretch', marginTop: 10, marginHorizontal: 20 }}
          />
      </View>
    );

    if (this.props.scroll) {
      return (
        <KeyboardAwareComponent
          shouldShow={() => { return true; }}
          shouldHide={() => { return true; }}
          >
          <GroupHeader data={this.state.data} small/>
          <Disclaimer {...this.props} />
          {content}
        </KeyboardAwareComponent>
      );
    }

    return content;
  },
  onSendPassword: function () {
    if (!this.state.password) {
      return alert.show(i18next.t('messages.wrong-password'));
    }
    this.setState({loadingPassword: true});
    app.client.groupBecomeMember(this.state.data.group_id, this.state.password, (response) => {
      this.setState({loadingPassword: false});
      if (response.success) {
        app.trigger('refreshGroup', true);
        this.props.navigator.popToTop();
      } else {
        if (response.err === 'wrong-password') {
          return alert.show(i18next.t('messages.wrong-password'));
        }
        return alert.show(i18next.t('messages.' + response.err));
      }
    });
  }
});

module.exports = GroupAskPassword;
