'use strict';

var React = require('react-native');
var {
  View,
  Text,
  ScrollView
  } = React;

var _ = require('underscore');
var i18next = require('../libs/i18next');
var app = require('../libs/app');
var s = require('../styles/style');
var alert = require('../libs/alert');
var ListItem = require('../components/ListItem');
var Button = require('../components/Button');
var LoadingView = require('../components/Loading');
var navigation = require('../navigation/index');
var DiscussionHeader = require('./DiscussionHeader');

i18next.addResourceBundle('en', 'RoomAccess', {
  'title': 'This discussion is private.',
  'disclaimer-public': 'This discussion is public. Any user can access it.',
  'disclaimer-public-2': 'You can switch this discussion to private mode. Then, only users you authorize will be able to join, participate and access history. Access will be based on invitation and/or password. The current members of this public discussion will remain members once this discussion switched to private. Caution, this action cannot be undone.',
  'switch-button': 'SWITCH TO PRIVATE MODE',
  'switch-disclaimer': 'Warning, this action is irreversible',
  'allow-members-join': 'Allow members to join this discussion',
  'allow-members-join-false': 'Community members will not be alowed to enter this discussion automatically',
  'allow-users-request': 'Allow users to request access',
  'allow-users-request-true': 'Users will be able to ask for an invitation to this discussion',
  'allow-users-request-false': 'Users will not be able to ask for an invitation to this discussion',
  'disclaimer': 'Display a message',
  'disclaimer-help': 'Message displayed to all users trying to join',
  'password': 'Set a password',
  'password-disclaimer': 'Users with the password can join without prior invitation.',
  'password-placeholder': 'Enter a password',
  'password-help': 'Between 4 and 255 characters',
  'password-success': 'Password saved'
});

var RoomAccessView = React.createClass({
  propTypes: {
    model: React.PropTypes.object,
    navigator: React.PropTypes.object
  },
  getInitialState: function () {
    this.passwordPattern = /(.{4,255})$/i;
    return {
      loading: true
    };
  },
  componentDidMount: function () {
    var what = {
      more: true,
      users: false,
      admin: true
    };
    app.client.roomRead(this.props.model.get('id'), what, _.bind(function (data) {
      if (data.err) {
        return alert.show(i18next.t('messages.' + data.err));
      }
      this.setState({
        loading: false,
        data: data,
        setPassword: !!data.password
      });
    }, this));
  },
  render: function () {
    if (this.state.loading) {
      return (<LoadingView />);
    }

    if (this.state.data.mode === 'private') {
      return this._renderPrivate();
    }

    return this._renderPublic();
  },
  _renderPrivate: function () {
    return (
      <ScrollView>
        <DiscussionHeader model={this.props.model} small />
        {this._renderPrivateTitle()}
        <View style={s.listGroup}>
          {this._renderGroupAllow()}

          <View style={{ marginTop: 20 }}/>
          <ListItem
            text={i18next.t('RoomAccess:allow-users-request')}
            type='switch'
            help={this.state.data.allow_user_request ? i18next.t('RoomAccess:allow-users-request-true') : i18next.t('RoomAccess:allow-users-request-false')}
            switchValue={this.state.data.allow_user_request}
            onSwitch={this.saveRoomData.bind(this, {allow_user_request: !this.state.data.allow_user_request})}
            />

          <View style={{ marginTop: 20 }}/>
          <ListItem
            onPress={() => navigation.navigate('RoomEditDisclaimer', this.state.data.room_id, (update, cb) => this.saveRoomData(update, cb))}
            text={i18next.t('RoomAccess:disclaimer')}
            type='edit-button'
            help={i18next.t('RoomAccess:disclaimer-help')}
            action
            autoCapitalize='none'
            value={_.unescape(this.state.data.disclaimer)}
            />
          {this._renderPassword()}
        </View>
      </ScrollView>
    );
  },
  _renderPrivateTitle: function () {
    return (
      <Text style={{ margin: 20 }}>
        <Text>{i18next.t('RoomAccess:title')}</Text>
      </Text>
    );
  },
  _renderPassword: function () {
    let passwordField = null;
    if (this.state.setPassword) {
      passwordField = (
        <ListItem
          ref='input'
          onPress={this._savePassword}
          placeholder={i18next.t('RoomAccess:password-placeholder')}
          value={this.state.data.password}
          maxLength={255}
          onChangeText={(password) => this.setState({
            data: _.extend(this.state.data, {password: password})
          })}
          type='input-button'
          help={i18next.t('RoomAccess:password-help')}
          />
      );
    }
    return (
      <View>
        <View style={{ marginTop: 20 }}/>
        <ListItem type='switch'
                  text={i18next.t('RoomAccess:password')}
                  switchValue={this.state.setPassword}
                  onSwitch={this.state.setPassword ? this._cleanPassword : () => { this.setState({ setPassword: true })}}
                  help={this.state.setPassword ? '' : i18next.t('RoomAccess:password-disclaimer')}
          />
        {passwordField}
      </View>
    );
  },
  _savePassword: function () {
    if (!this.passwordPattern.test(this.state.data.password)) {
      return alert.show(i18next.t('RoomAccess:password-help'));
    }

    this.saveRoomData({password: this.state.data.password}, () => {
      alert.show(i18next.t('RoomAccess:password-success'));
      this.setState({
        setPassword: true
      });
    });
  },
  _cleanPassword: function () {
    this.saveRoomData({password: null}, () => {
      this.setState({
        setPassword: false
      });
    });
  },
  _renderGroupAllow: function () {
    if (!this.state.data.group_id) {
      return null;
    }

    var update = this.state.data.allow_group_member ?
    {allow_group_member: false, add_users_to_allow: true} :
    {allow_group_member: true};

    return (
      <View>
        <Text style={{ marginTop: 20 }}/>
        <ListItem
          text={i18next.t('RoomAccess:allow-members-join')}
          help={this.state.data.allow_group_member ? '' : i18next.t('RoomAccess:allow-members-join-false')}
          type='switch'
          onSwitch={this.saveRoomData.bind(this, update)}
          switchValue={this.state.data.allow_group_member}
          />
      </View>
    );
  },
  _renderPublic: function () {
    return (
      <View style={{ flexDirection: 'column', flex: 1 }}>
        <ScrollView>
          <DiscussionHeader model={this.props.model} small />
          <Text style={[s.block]}>{i18next.t('RoomAccess:disclaimer-public')}</Text>
          <Text style={[s.block]}>{i18next.t('RoomAccess:disclaimer-public-2')}</Text>
          <View style={{ flex: 1 }}/>
        </ScrollView>
        <View style={{ margin: 20 }}>
          <Button
            onPress={() => this._switchToPrivateMode()}
            label={i18next.t('RoomAccess:switch-button')}
            type='red'
            />
        </View>
      </View>
    );
  },
  _switchToPrivateMode: function () {
    alert.askConfirmation(
      i18next.t('RoomAccess:switch-button'),
      i18next.t('RoomAccess:switch-disclaimer'),
      () => app.client.roomSetPrivate(this.state.data.room_id, (response) => {
        if (response.err) {
          return alert.show(i18next.t('messages.' + response.err));
        }

        this.setState({
          data: _.extend(this.state.data, {mode: 'private'})
        });
      }),
      () => {
      }
    );
  },
  saveRoomData (update, callback) {
    app.client.roomUpdate(this.state.data.room_id, update, (response) => {
      if (response.err) {
        alert.show(i18next.t('messages.' + response.err));
        if (callback) {
          return callback(response.err);
        }
        return;
      }

      this.setState({data: _.extend(this.state.data, update)});

      if (callback) {
        callback();
      }
    });
  }
});


module.exports = RoomAccessView;
