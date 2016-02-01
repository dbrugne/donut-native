'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableHighlight,
  Image
} = React;

var app = require('../libs/app');
var common = require('@dbrugne/donut-common/mobile');
var ListItem = require('../components/ListItem');
var s = require('../styles/style');
var alert = require('../libs/alert');
var navigation = require('../navigation/index');

var i18next = require('../libs/i18next');
i18next.addResourceBundle('en', 'roomUser', {
  'op': 'Make moderator',
  'modal-description-op': 'Are you sure you want to make @__username__ moderator?',
  'deop': 'Remove from moderator',
  'modal-description-deop': 'Are you sure you want to remove @__username__ from moderators?',
  'voice': 'Unmute',
  'modal-description-voice': 'Are you sure you want to unmute @__username__?',
  'devoice': 'Mute',
  'modal-description-devoice': 'Are you sure you want to mute @__username__?',
  'ban': 'Kick and ban',
  'modal-description-ban': 'Are you sure you want to ban @__username__?',
  'deban': 'Unban',
  'modal-description-deban': 'Are you sure you want to unban @__username__?',
  'kick': 'Kick',
  'modal-description-kick': 'Are you sure you want to kick @__username__?',
  'title': 'Actions on this user',
  'chat': 'Chat one-to-one'
});

var ProfileView = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    roomId: React.PropTypes.string,
    parentCallback: React.PropTypes.func,
    navigator: React.PropTypes.object
  },
  getInitialState: function () {
    return {
      loading: true,
      isBanned: this.props.user.isBanned,
      isDevoiced: this.props.user.isDevoiced,
      isOp: this.props.user.isOp
    };
  },

  render: function () {
    var avatarUrl = common.cloudinary.prepare(this.props.user.avatar, 120);
    var role = null;
    if (this.state.isOp) {
      role = <Text style={[styles.role]}>{i18next.t('op')}</Text>;
    }
    if (this.props.user.isOwner) {
      role = <Text style={[styles.role]}>{i18next.t('owner')}</Text>;
    }
    return (
      <ScrollView style={styles.main}>
        <TouchableHighlight onPress={() => navigation.navigate('Profile', {type: 'user', id: this.props.user.user_id, identifier: '@' + this.props.user.username})}>
          <View style={[styles.container, {position: 'relative'}]}>
            <Image style={styles.avatar} source={{uri: avatarUrl}} />
            <Text style={[styles.statusText,
              styles.status,
              this.props.user.status === 'connecting' && styles.statusConnecting,
              this.props.user.status === 'offline' && styles.statusOffline,
              this.props.user.status === 'online' && styles.statusOnline]}>{this.props.user.status}</Text>
            <Text style={[styles.username]}>@{this.props.user.username}</Text>
            {role}
          </View>
        </TouchableHighlight>
          <View style={[s.listGroup]}>
            <Text style={s.listGroupItemSpacing} />
            {this._renderActions()}
            <Text style={s.listGroupItemSpacing} />
          </View>
      </ScrollView>
    );
  },

  _renderActions: function () {
    if (this.props.user.isOwner) {
      return null;
    }
    return (
    <View>
      <ListItem
        key='chat'
        text={i18next.t('roomUser:chat')}
        type='edit-button'
        first
        title={i18next.t('roomUser:title')}
        action
        onPress={() => app.trigger('joinUser', this.props.user.user_id)}
        />
      <ListItem
        key='deop'
        text={(this.state.isOp) ? i18next.t('roomUser:deop') : i18next.t('roomUser:op')}
        type='switch'
        switchValue={this.state.isOp}
        icon='shield'
        onSwitch={() => {
          (this.state.isOp)
          ? this._onDeop()
          : this._onOp();
        }}
        />
      <ListItem
        key='voice'
        text={(this.state.isDevoiced) ? i18next.t('roomUser:voice') : i18next.t('roomUser:devoice')}
        type='switch'
        switchValue={this.state.isDevoiced}
        icon='microphone'
        onSwitch={() => {
          (this.state.isDevoiced)
          ? this._onVoice()
          : this._onDevoice();
        }}
        />
      <ListItem
        key='unban'
        text={(this.state.isBanned) ? i18next.t('roomUser:deban') : i18next.t('roomUser:ban')}
        type='switch'
        icon='ban'
        switchValue={this.state.isBanned}
        onSwitch={() => {
          (this.state.isBanned)
          ? this._onUnban()
          : this._onBan();
        }}
        />
      <ListItem
        key='kick'
        text={i18next.t('roomUser:kick')}
        type='edit-button'
        icon='times'
        onPress={() => this._onKick()}
        action
        />
      </View>
    );
  },

  _onDeop: function () {
    alert.askConfirmation(
      i18next.t('roomUser:deop'),
      i18next.t('roomUser:modal-description-deop', {username: this.props.user.username}),
      () => {
        app.client.roomDeop(this.props.roomId, this.props.user.user_id, (response) => {
          if (response.err) {
            return alert.show(response.err);
          }
          this.setState({isOp: false});
          this.props.parentCallback();
        });
      },
      () => this.setState({isOp: true})
    );
  },
  _onOp: function () {
    alert.askConfirmation(
      i18next.t('roomUser:op'),
      i18next.t('roomUser:modal-description-op', {username: this.props.user.username}),
      () => {
        app.client.roomOp(this.props.roomId, this.props.user.user_id, (response) => {
          if (response.err) {
            return alert.show(i18next.t('messages.' + response.err));
          }
          this.setState({isOp: true});
          this.props.parentCallback();
        });
      },
      () => this.setState({isOp: false})
    );
  },
  _onDevoice: function () {
    alert.askConfirmation(
      i18next.t('roomUser:devoice'),
      i18next.t('roomUser:modal-description-devoice', {username: this.props.user.username}),
      () => {
        app.client.roomDevoice(this.props.roomId, this.props.user.user_id, null, (response) => {
          if (response.err) {
            return alert.show(i18next.t('messages.' + response.err));
          }
          this.setState({isDevoiced: true});
          this.props.parentCallback();
        });
      },
      () => {}
    );
  },
  _onVoice: function () {
    alert.askConfirmation(
      i18next.t('roomUser:voice'),
      i18next.t('roomUser:modal-description-voice', {username: this.props.user.username}),
      () => {
        app.client.roomVoice(this.props.roomId, this.props.user.user_id, (response) => {
          if (response.err) {
            return alert.show(i18next.t('messages.' + response.err));
          }
          this.setState({isDevoiced: false});
          this.props.parentCallback();
        });
      },
      () => {}
    );
  },
  _onUnban: function () {
    alert.askConfirmation(
      i18next.t('roomUser:deban'),
      i18next.t('roomUser:modal-description-deban', {username: this.props.user.username}),
      () => {
        app.client.roomDeban(this.props.roomId, this.props.user.user_id, (response) => {
          if (response.err) {
            return alert.show(i18next.t('messages.' + response.err));
          }
          this.setState({isBanned: false});
          this.props.parentCallback();
        });
      },
      () => {}
    );
  },
  _onBan: function () {
    alert.askConfirmation(
      i18next.t('roomUser:ban'),
      i18next.t('roomUser:modal-description-ban', {username: this.props.user.username}),
      () => {
        app.client.roomBan(this.props.roomId, this.props.user.user_id, null, (response) => {
          if (response.err) {
            return alert.show(i18next.t('messages.' + response.err));
          }
          this.setState({isBanned: true});
          this.props.parentCallback();
        });
      },
      () => {}
    );
  },
  _onKick: function () {
    alert.askConfirmation(
      i18next.t('roomUser:kick'),
      i18next.t('roomUser:modal-description-kick', {username: this.props.user.username}),
      () => {
        app.client.roomKick(this.props.roomId, this.props.user.user_id, null, (response) => {
          if (response.err) {
            return alert.show(i18next.t('messages.' + response.err));
          }
          this.props.navigator.pop();
          this.props.parentCallback();
        });
      },
      () => {}
    );
  }
});

var styles = StyleSheet.create({
  main: {
    flexWrap: 'wrap',
    flexDirection: 'column',
    backgroundColor: '#f0f0f0'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF'
  },
  role: {
    marginBottom: 5
  },
  avatar: {
    width: 120,
    height: 120,
    marginTop: 20
  },
  username: {
    color: '#333333',
    fontFamily: 'Open Sans',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5
  },
  usernameGray: {
    color: '#b6b6b6'
  },
  status: {
    marginBottom: 8,
    alignSelf: 'center',
    textAlign: 'center',
    flex: 1,
    fontWeight: '400',
    fontSize: 12,
    fontFamily: 'Open Sans',
    width: 120,
    paddingLeft: 5,
    paddingRight: 5,
    overflow: 'hidden'
  },
  statusOnline: { backgroundColor: 'rgba(79, 237, 192, 0.8)' },
  statusConnecting: { backgroundColor: 'rgba(255, 218, 62, 0.8)' },
  statusOffline: { backgroundColor: 'rgba(119,119,119,0.8)' },
  statusText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 16,
    fontFamily: 'Open Sans'
  },
  icon: {
    width: 14,
    height: 14,
    color: '#c7c7c7'
  },
  iconOnline: {
    color: '#4fedc0'
  }
});

module.exports = ProfileView;

