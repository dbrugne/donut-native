'use strict';

var React = require('react-native');
var app = require('../libs/app');
var Alert = require('../libs/alert');
var ListItem = require('../components/ListItem');
var Button = require('../components/Button');
var Disclaimer = require('../components/Disclaimer');
var DiscussionHeader = require('./DiscussionHeader');

var {
  View,
  Text,
  TextInput,
  StyleSheet
  } = React;

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'discussionBlockedJoin', {
  'request': 'REQUEST AN ACCESS',
  'password': 'PASSWORD',
  'send-request': 'SEND REQUEST',
  'send': 'SEND',
  'enter-password': 'ENTER THE PASSWORD',
  'request-placeholder': 'Your motivations ...',
  'request-disclaimer': 'Your contact details and your following message (optional) will be sent to the moderators of this discussion.',
  'password-disclaimer': 'Enter the discussion password',
  'password-placeholder': 'password',
  'join': 'join',
  'invite-only': 'This discussion is only accessible from a moderator invitation.',
  'allowed-pending': [
    'You already have a membership request pending.',
    'You will be notified when accepted.'
  ],
  'allowed-success': 'Success ! You will be notified when accepted.',
  'wrong-password': 'Incorrect password',
  'spam-password': 'You need to wait before trying again'
});

var DiscussionBlockedJoin = React.createClass({
  propTypes: {
    data: React.PropTypes.object,
    model: React.PropTypes.object,
    navigator: React.PropTypes.object
  },

  getInitialState: function () {
    return {
      type: (this.props.data.allow_user_request
        ? 'request'
        : this.props.data.hasPassword
          ? 'password'
          : null
      ),
      request: null,
      password: null,
      loadingRequest: false,
      loadingpassword: false,
      messageRequest: null
    };
  },

  render: function () {
    return (
      <View style={styles.container}>
        <DiscussionHeader model={this.props.model} small>
          {this._renderActions()}
        </DiscussionHeader>

        {this._renderDisclaimer()}

        {this._renderContent()}

      </View>
    );
  },

  _renderActions: function () {
    // no allow user request or password, no action possible
    if (!this.props.data.allow_user_request || !this.props.data.hasPassword) {
      return null;
    }

    return (
      <View style={{ alignSelf: 'stretch' }}>
        {this._renderAskMembershipButton()}
        {this._renderPasswordButton()}
      </View>
    );
  },
  _renderAskMembershipButton: function () {
    if (!this.props.data.allow_user_request || this.state.type === 'request') {
      return null;
    }

    return (
      <Button onPress={() => this.setState({type: 'request'})}
              label={i18next.t('discussionBlockedJoin:request')}
              type='white'
              loading={this.state.loadingRequest}
              style={{ alignSelf: 'stretch', marginHorizontal: 20, marginTop: 20 }}
        />
    );
  },
  _renderPasswordButton: function () {
    if (!this.props.data.hasPassword || this.state.type === 'password') {
      return null;
    }

    return (
      <Button onPress={() => this.setState({type: 'password'})}
              label={i18next.t('discussionBlockedJoin:password')}
              type='white'
              loading={this.state.loadingPassword}
              style={{ alignSelf: 'stretch', marginHorizontal: 20, marginTop: 20 }}
        />
    );
  },
  _renderContent () {
    if (!this.state.type) {
      return;
    }

    if (this.state.type === 'request') {
      return this._renderAllowUserRequest();
    }

    return this._renderPassword();
  },
  _renderAllowUserRequest: function () {
    if (this.props.data.isAllowedPending) {
      return (
        <View style={{ marginVertical: 20, alignSelf: 'stretch', paddingHorizontal: 20 }}>
          <Text
            style={{ fontFamily: 'Open Sans', fontSize: 12, color: '#F15261', alignSelf: 'stretch' }}>{i18next.t('discussionBlockedJoin:allowed-pending')}</Text>
        </View>
      );
    }

    if (this.state.messageRequest) {
      return (
        <View style={{ marginVertical: 20, alignSelf: 'stretch', paddingHorizontal: 20 }}>
          <Text
            style={{ fontFamily: 'Open Sans', fontSize: 12, color: '#18C095', alignSelf: 'stretch' }}>{i18next.t('discussionBlockedJoin:allowed-success')}</Text>
        </View>
      );
    }

    return (
      <View
        style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'column', alignItems: 'center', paddingVertical: 20 }}>
        <View
          style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: 20, alignSelf: 'stretch' }}>
          <View style={{width: 1, height: 40, backgroundColor: '#FC2063'}}/>
          <TextInput autoCapitalize='none'
                     ref='input'
                     placeholder={i18next.t('discussionBlockedJoin:request-placeholder')}
                     onChange={(event) => this.setState({request: event.nativeEvent.text})}
                     value={this.state.request}
                     style={{ flex: 1, fontFamily: 'Open Sans', fontSize: 14, fontWeight: '400', color: '#333', height: 40, paddingVertical: 8, paddingHorizontal: 10 }}
            />
        </View>
        <View style={{ flex: 1 }}/>
        <View style={{ height: 1, alignSelf: 'stretch', backgroundColor: '#E7ECF3', marginBottom: 10 }}/>
        <Text
          style={{ alignSelf: 'stretch', marginHorizontal: 20, fontFamily: 'Open Sans', fontSize: 12, color: '#AFBAC8', fontStyle: 'italic' }}>{i18next.t('discussionBlockedJoin:request-disclaimer')}</Text>
        <Button type='gray'
                onPress={() => this.onUserRequest()}
                label={i18next.t('discussionBlockedJoin:send-request')}
                loading={this.state.loadingRequest}
                style={{ alignSelf: 'stretch', marginTop: 10, marginHorizontal: 20 }}
          />
      </View>
    );
  },
  _renderDisclaimer: function () {
    // no allow user request or password, no action possible
    if (!this.props.data.allow_user_request && !this.props.data.hasPassword) {
      return (
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch' }}>
          <Disclaimer {...this.props} title={i18next.t('discussionBlockedJoin:invite-only')}/>
        </View>
      );
    }

    return (
      <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch' }}>
        <Disclaimer {...this.props} />
      </View>
    );
  },
  onUserRequest: function () {
    this.setState({loadingRequest: true});
    app.client.roomJoinRequest(this.props.data.room_id, this.state.request, (response) => {
      this.setState({loadingRequest: false});
      if (response.err) {
        Alert.show(response.err);
      } else {
        this.setState({
          messageRequest: true
        });
      }
    });
  },
  _renderPassword: function () {
    return (
      <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'column', alignItems: 'center', paddingVertical: 20 }}>
        <View style={{alignSelf: 'stretch'}}>
          <ListItem type='input'
                    autoCapitalize='none'
                    ref='input'
                    first
                    last
                    placeholder={i18next.t('discussionBlockedJoin:password-placeholder')}
                    onChange={(event) => this.setState({password: event.nativeEvent.text})}
                    value={this.state.password}
                    style={{ alignSelf: 'stretch' }}
                    title={i18next.t('discussionBlockedJoin:enter-password')}
                    />
        </View>
        <View style={{ flex: 1 }}/>
        <Button type='gray'
                onPress={() => this.onValidatePassword()}
                label={i18next.t('discussionBlockedJoin:send')}
                loading={this.state.loadingPassword}
                style={{ alignSelf: 'stretch', marginTop: 10, marginHorizontal: 20 }}
          />
      </View>
    );
  },
  onValidatePassword: function () {
    this.setState({loadingPassword: true});
    app.client.roomJoin(this.props.data.room_id, this.state.password, (response) => {
      this.setState({loadingPassword: false});
      if (response.err) {
        Alert.show(i18next.t('discussionBlockedJoin:' + response.err));
      } else {
        app.trigger('joinRoom', this.props.data.room_id);
        this.props.navigator.pop();
      }
    });
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

module.exports = DiscussionBlockedJoin;
