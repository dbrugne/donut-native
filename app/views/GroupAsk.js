'use strict';

var React = require('react-native');
var {
  View,
  StyleSheet
  } = React;

var Button = require('../components/Button');
var app = require('../libs/app');
var navigation = require('../navigation/index');
var Disclaimer = require('../components/Disclaimer');
var LoadingView = require('../components/Loading');
var GroupHeader = require('./GroupHeader');
var alert = require('../libs/alert');
var GroupAskEmail = require('./GroupAskEmail');
var GroupAskPassword = require('./GroupAskPassword');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'GroupAsk', {
  'request-title': 'REQUEST AN ACCESS',
  'password-title': 'ENTER PASSWORD',
  'domain-title': 'AUTHORIZED EMAIL',
  'email-title': 'I have an authorized e-mail',
  'other-request': 'You can join this community only if invited by its moderators.',
  'wrong-format-email': 'Mail address is not valid',
  'success-email': 'The email has been successfully added to your account. You will receive a verification e-mail.',
  'mail-already-exist': 'This mail address is already used',
  'info-password': 'Enter the password :',
  'placeholder-password': 'password',
  'send': 'send',
  'wrong-password': 'invalid password',
  'allow-pending': 'An access request is already pending',
  'info-request': 'Your contact details and your following message (optional) will be sent to the moderators of this community.',
  'placeholder-request': 'Your motivations, background ...',
  'allowed-pending': 'Access to this community is by invitation, and you already have a request in progress.',
  'success-request': 'Request sent ! You will be notified when accepted.',
  'message-wrong-format': 'The message should be less than 200 character',
  'not-confirmed': 'Action authorized to verified accounts only. Verify your e-mail.'
});

var GroupAskMembership = React.createClass({
  propTypes: {
    data: React.PropTypes.any,
    navigator: React.PropTypes.object
  },
  getInitialState: function () {
    return {
      type: null,
      data: this.props.data,
      options: null,
      loading: true,
      loadingRequest: false,
      loadingPassword: false,
      loadingDomain: false
    };
  },
  onFocus: function () {
    this.onRefresh();
  },
  onRefresh: function () {
    app.client.groupBecomeMember(this.state.data.group_id, null, this.onData);
  },
  onData (response) {
    // Anything but already a member : show an error
    if (response.err && response.err !== 'already-member') {
      return alert.show(i18next.t('messages.' + response.err));
    }

    // already a member or success or no options to show, redraw group page
    if (response.err || response.success || !response.options) {
      return this.updateGroup();
    }

    return this.setState({
      options: response.options,
      loading: false
    });
  },
  render: function () {
    if (this.state.loading) {
      return (
        <LoadingView />
      );
    }

    return (
      <View style={styles.container}>
        <GroupHeader data={this.state.data}>
          {this._renderActions()}
        </GroupHeader>

        {this._renderDisclaimer()}
        {this._renderContent()}

      </View>
    );
  },
  _renderActions: function () {
    return (
      <View style={{ alignSelf: 'stretch' }}>
        {this._renderAskMembershipButton()}
        {this._renderPasswordButton()}
        {this._renderAllowedDomains()}
      </View>
    );
  },
  _renderPasswordButton: function () {
    if (!this.state.options.password) {
      return null;
    }

    return (
      <Button onPress={() => navigation.navigate('GroupAskPassword', this.state.data)}
              label={i18next.t('GroupAsk:password-title')}
              type='white'
              active={this.state.type === 'password'}
              loading={this.state.loadingPassword}
              style={{ alignSelf: 'stretch', marginHorizontal: 40, marginTop: 10 }}
        />
    );
  },
  _renderAllowedDomains: function () {
    if (!this.state.options.allowed_domains) {
      return null;
    }

    return (
      <Button onPress={() => navigation.navigate('GroupAskEmail', {data: this.state.data, options: this.state.options})}
              label={i18next.t('GroupAsk:domain-title')}
              type='white'
              active={this.state.type === 'domain'}
              loading={this.state.loadingDomain}
              style={{ alignSelf: 'stretch', marginHorizontal: 40, marginTop: 10 }}
        />
    );
  },
  _renderDisclaimer: function () {
    return (
      <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch' }}>
        <Disclaimer data={this.state.data} navigator={this.props.navigator}/>
      </View>
    );
  },
  _countOptions: function () {
    return (this.state.options.request ? 1 : 0) + (this.state.options.password ? 1 : 0) + (this.state.options.allowed_domains ? 1 : 0);
  },
  _renderContent: function () {
    if (this._countOptions() > 1) {
      return null;
    }

    if (this.state.options.password) {
      return (
        <GroupAskPassword navigator={this.props.navigator} data={this.state.data} />
      );
    }

    return (
      <GroupAskEmail navigator={this.props.navigator} data={this.state.data} domains={this.state.options.allowed_domains} />
    );
  },
  updateGroup: function () {
    this.props.navigator.popToTop(); // @todo handle in navigation.popToTop() wrapper
    app.trigger('refreshGroup', true);
  }
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1
  }
});

module.exports = GroupAskMembership;
