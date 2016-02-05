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
var LoadingView = require('../components/Loading');
var common = require('@dbrugne/donut-common/mobile');
var emojione = require('emojione');
var navigation = require('../navigation/index');

i18next.addResourceBundle('en', 'RoomAccess', {
  'title': 'This discussion is private',
  'disclaimer-public': 'This donut is public. Any user can access it.',
  'disclaimer-public-2': 'You can switch this donut to private mode. Then, only users you authorize will be able to join, participate and access history. Access will be based on invitation and/or password. The current members of this public donut will remain members once this donut switched to private. Caution, this action cannot be undone.',
  'switch-button': 'Switch to private mode',
  'switch-disclaimer': 'Warning, this action is irreversible',
  'allow-members-join': 'Allow members to join this discussion',
  'allow-members-join-true': 'Community members will be automatically allowed to enter this discussion',
  'allow-members-join-false': 'Community members will not be alowed to enter this discussion automatically',
  'allow-users-request': 'Allow users to request access',
  'allow-users-request-true': 'Users will be able to ask for an invitation to this discussion',
  'allow-users-request-false': 'Users will be not be able to ask for an invitation to this discussion',
  'disclaimer': 'Display a message',
  'disclaimer-help': 'This message will be displayed to any not allowed user trying to enter this discussion'
});

var RoomAccessView = React.createClass({
  propTypes: {
    room: React.PropTypes.object,
    navigator: React.PropTypes.object
  },
  getInitialState: function () {
    return {
      loading: true
    };
  },
  componentDidMount: function() {
    var what = {
      more: true,
      users: false,
      admin: true
    };
    app.client.roomRead(this.props.room.id, what, _.bind(function (data) {
      if (data.err) {
        return alert.show(i18next.t('mesage.' + data.err));
      }
      this.setState({
        loading: false,
        data: data
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
      <View style={{ flexDirection: 'column', alignItems: 'stretch', flex: 1, backgroundColor: '#f0f0f0' }}>
        <Text style={[s.listGroupTitle, s.marginTop20]}>{i18next.t('RoomAccess:title')}</Text>
        <View style={s.listGroup}>
          {this._renderGroupAllow()}
          <Text style={s.listGroupItemSpacing}/>
          <ListItem
            text={i18next.t('RoomAccess:allow-users-request')}
            type='switch'
            help={this.state.data.allow_user_request ? i18next.t('RoomAccess:allow-users-request-true') : i18next.t('RoomAccess:allow-users-request-false')}
            switchValue={this.state.data.allow_user_request}
            onSwitch={this.saveRoomData.bind(this, {allow_user_request: !this.state.data.allow_user_request})}
          />
          <Text style={s.listGroupItemSpacing}/>
          <ListItem
            onPress={() => navigation.navigate('RoomEditDisclaimer', this.state.data.room_id, (update, cb) => this.saveRoomData(update, cb))}
            text={i18next.t('RoomAccess:disclaimer')}
            type='edit-button'
            help={i18next.t('RoomAccess:disclaimer-help')}
            action
            value={this.state.data.disclaimer}
          />
        </View>
      </View>
    );
  },
  _renderGroupAllow: function() {
    if (!this.state.data.group_id) {
      return null;
    }

    var update = this.state.data.allow_group_member ?
    {allow_group_member: false, add_users_to_allow: true} :
    {allow_group_member: true};

    return (
      <View>
        <Text style={s.listGroupItemSpacing}/>
        <ListItem
          text={i18next.t('RoomAccess:allow-members-join')}
          help={this.state.data.allow_group_member ? i18next.t('RoomAccess:allow-members-join-true') : i18next.t('RoomAccess:allow-members-join-false')}
          type='switch'
          onSwitch={this.saveRoomData.bind(this, update)}
          switchValue={this.state.data.allow_group_member}
        />
      </View>
    );
  },
  _renderPublic: function () {
    return (
      <ScrollView style={{backgroundColor: '#f0f0f0' }}>
        <Text style={[s.block]}>{i18next.t('RoomAccess:disclaimer-public')}</Text>
        <Text style={[s.block]}>{i18next.t('RoomAccess:disclaimer-public-2')}</Text>
        <View style={s.marginTop20}>
          <ListItem
            onPress={() => this._switchToPrivateMode()}
            text={i18next.t('RoomAccess:switch-button')}
            type='button'
            warning
            action
            first
          />
        </View>
      </ScrollView>
    );
  },
  _switchToPrivateMode: function () {
    alert.askConfirmation(
      i18next.t('RoomAccess:switch-button'),
      i18next.t('RoomAccess:switch-disclaimer'),
      () => app.client.roomSetPrivate(this.state.data.room_id, (response) => {
        if (response.err) {
          return alert.show(i18next.t('message.' + response.err));
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
        alert.show(i18next.t('message.' + response.err));
        if (callback) {
          return callback(response.err);
        }
        return;
      }

      this.setState({
        data: _.extend(this.state.data, update)
      });

      if (callback) {
        callback();
      }
    });
  }
});


module.exports = RoomAccessView;
