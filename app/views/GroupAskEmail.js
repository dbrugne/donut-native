'use strict';

var React = require('react-native');
var {
  View,
  Text
} = React;

var _ = require('underscore');
var app = require('../libs/app');
var alert = require('../libs/alert');
var Button = require('../components/Button');
var Disclaimer = require('../components/Disclaimer');
var ListItem = require('../components/ListItem');
var GroupHeader = require('./GroupHeader');
var KeyboardAwareComponent = require('../components/KeyboardAware');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'GroupAskEmail', {
  'info-email': 'I HAVE AN AUTHORIZED E-MAIL',
  'email': 'e-mail',
  'domains': 'Authorized domains:',
  'add-email': 'SEND',
  'missing-email': 'Mail address is required',
  'wrong-format-email': 'Mail address is not valid',
  'mail-already-exist': 'This mail address is already used',
  'success-email': 'The email has been successfully added to your account. You will receive a verification e-mail.',
  'not-allowed-domain': 'The email entered is not part of authorized domains'
});

var GroupAskEmail = React.createClass({
  propTypes: {
    data: React.PropTypes.any,
    navigator: React.PropTypes.object,
    domains: React.PropTypes.array,
    scroll: React.PropTypes.bool
  },
  getInitialState: function () {
    return {
      data: this.props.data,
      domains: this.props.domains,
      email: '',
      loadingEmail: false
    };
  },
  render: function () {
    let content = (
      <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'column', paddingVertical: 20 }}>
        <View style={{alignSelf: 'stretch'}}>
          <ListItem type='input'
                    autoCapitalize='none'
                    ref='input'
                    first
                    last
                    placeholder={i18next.t('GroupAskEmail:email')}
                    onChangeText={(text) => this.setState({email: text})}
                    value={this.state.email}
                    style={{ alignSelf: 'stretch' }}
                    title={i18next.t('GroupAskEmail:info-email')}
            />
        </View>

        <View style={{ flex: 1 }}/>
        
        <Text style={{ marginTop: 20, alignSelf: 'stretch', marginHorizontal: 20, fontFamily: 'Open Sans', fontSize: 12, color: '#AFBAC8', fontStyle: 'italic' }}>{i18next.t('GroupAskEmail:domains')}</Text>
        {_.map(this.state.domains, (domain, index) => {
          return (
            <Text key={'authorized-domain-'+index} style={{ marginHorizontal: 20, fontFamily: 'Open Sans', fontSize: 12, color: '#AFBAC8', fontStyle: 'italic' }}>{domain}</Text>
          );
        })}

        <Button type='gray'
                onPress={this.onAddEmail}
                label={i18next.t('GroupAskEmail:add-email')}
                loading={this.state.loadingEmail}
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
  onAddEmail: function () {
    if (!this.state.email) {
      return alert.show(i18next.t('GroupAskEmail:missing-email'));
    }
    if (!this._isAllowedDomain()) {
      return alert.show(i18next.t('GroupAskEmail:not-allowed-domain'));
    }
    app.client.accountEmail(this.state.email, 'add', _.bind(function (response) {
      if (response.success) {
        alert.show(i18next.t('GroupAskEmail:success-email'));
        app.trigger('refreshGroup', true);
        this.props.navigator.popToTop();
      } else {
        if (response.err === 'mail-already-exist') {
          return alert.show(i18next.t('GroupAskEmail:mail-already-exist'));
        }
        if (response.err === 'wrong-format') {
          return alert.show(i18next.t('GroupAskEmail:wrong-format-email'));
        }
        return alert.show(i18next.t('messages.' + response.err));
      }
    }, this));
  },
  _isAllowedDomain: function() {
    if (!this.state.email || this.state.email.split('@').length !== 2) {
      return false;
    }
    var domain = '@' + _.last(this.state.email.split('@')).toLowerCase();
    return _.contains(_.map(this.state.domains, (d) => { return d.toLowerCase(); }), domain);
  }
});

module.exports = GroupAskEmail;
